package com.google.sps.servlets;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
@WebServlet("/search")
public class SearchServlet extends HttpServlet {

  private class Post implements Comparable<Post> {
    private String title;
    private String description;
    private Location location;
    private double pay;
    private double distance;
    private long id;
    private double score;

    public Post(
        String title,
        String description,
        double lat,
        double lng,
        double price,
        double distance,
        long id) {
      this.title = title;
      this.description = description;
      this.location = new Location(lat, lng);
      this.pay = price;
      this.distance = Math.round(distance);
      this.id = id;
      this.score = 0;
    }

    public double computeScore(String[] kws) {
      Set<String> Kapp = new HashSet<String>();
      String[] words = (description + " " + title).split("([.,!?:;()&\"\\s+])");
      for (int i = 0; i < words.length; i++) {
        Kapp.add(words[i]);
      }
      for (int i = 0; i < kws.length; i++) {
        if (Kapp.contains(kws[i])) {
          score++;
          break;
        }
      }
      return score / distance;
    }

    public int compareTo(Post other) {
      return Double.compare(other.score, score);
    }

    public String toString() {
      return title
          + " "
          + description
          + " "
          + location.lat
          + " "
          + location.lng
          + " "
          + pay
          + " "
          + distance;
    }
  }

  private static class Location {
    double lat;
    double lng;

    public Location(double lat, double lng) {
      this.lat = lat;
      this.lng = lng;
    }
  }

  // miles
  private double distance(double lat1, double lon1, double lat2, double lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    } else {
      double theta = lon1 - lon2;
      double dist =
          Math.sin(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2))
              + Math.cos(Math.toRadians(lat1))
                  * Math.cos(Math.toRadians(lat2))
                  * Math.cos(Math.toRadians(theta));
      dist = Math.acos(dist);
      dist = Math.toDegrees(dist);
      dist = dist * 60 * 1.1515;
      return (dist);
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    System.out.println("test");
    /* int r = Integer.parseInt(request.getParamter("radius")); */
    String[] kws = request.getParameter("keywords").split(",");
    double lat = Double.parseDouble(request.getParameter("lat"));
    double lng = Double.parseDouble(request.getParameter("lng"));

    final double OFFSET = 0.5;
    double lngUpper = lng + OFFSET;
    double lngLower = lng - OFFSET;
    double latLower = lat - OFFSET;
    double latUpper = lat + OFFSET;
    Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    // Query<Entity> all = Query.newEntityQueryBuilder().setKind("Post").build();
    // QueryResults<Entity> all_posts = datastore.run(all);
    // while (all_posts.hasNext()) {
    //   datastore.delete(all_posts.next().getKey());
    // }

    Query<Entity> query =
        Query.newEntityQueryBuilder()
            .setKind("Post")
            .setFilter(
                CompositeFilter.and(
                    PropertyFilter.le("lng", lngUpper), PropertyFilter.ge("lng", lngLower)))
            .setFilter(
                CompositeFilter.and(
                    PropertyFilter.le("lat", latUpper), PropertyFilter.ge("lat", latLower)))
            .build();

    QueryResults<Entity> user_posts = datastore.run(query);

    ArrayList<Post> postsIncreasingDistance = new ArrayList<>();
    while (user_posts.hasNext()) {
      //   System.out.println("in");
      Entity temp_post = user_posts.next();
      double otherLat;
      try {
        otherLat = Double.parseDouble(temp_post.getString("lat"));
      } catch (ClassCastException e) {
        otherLat = temp_post.getDouble("lat");
      }
      double otherLng;
      try {
        otherLng = Double.parseDouble(temp_post.getString("lng"));
      } catch (ClassCastException e) {
        otherLng = temp_post.getDouble("lng");
      }

      double computedDistance = distance(lat, lng, otherLat, otherLng);

      if (computedDistance <= 30) {
        // need another nested if to check for matching categories
        // String category = temp_post.getString("category");
        // for (int i = 0; i < kws.length; i++) {
        //   if (kws[i].toLowerCase().equals(category.toLowerCase())) {
        //     String title = temp_post.getString("title");
        //     String description = temp_post.getString("description");
        //     String price = temp_post.getString("pay");
        //     Post newPost = new Post(title, description, lat, lng, price, computedDistance);
        //     postsIncreasingDistance.add(newPost);
        //     break;
        //   }
        //  }
        String title = temp_post.getString("title");
        String description = temp_post.getString("description");
        double price;
        try {
          price = temp_post.getDouble("pay");
        } catch (ClassCastException e) {
          price = Double.parseDouble(temp_post.getString("pay"));
        }

        Post newPost =
            new Post(
                title, description, lat, lng, price, computedDistance, temp_post.getKey().getId());
        postsIncreasingDistance.add(newPost);
        newPost.computeScore(kws);
      }
    }

    Collections.sort(postsIncreasingDistance);
    // System.out.println(postsIncreasingDistance);
    Gson gson = new Gson();
    response.setContentType("application/json");
    response.getWriter().println(gson.toJson(postsIncreasingDistance));

    /* // Build the SortOptions with 2 sort keys
    SortOptions.Builder sortOptionBuilder =
        SortOptions.newBuilder()
            .addSortExpression(
                SortExpression.newBuilder()
                    .setExpression(
                        "pow(pow(lat - " + lat + ", 2) + pow(lng - " + lng + ", 2), (1/2))")
                    .setDirection(SortExpression.SortDirection.DESCENDING)
                    .setDefaultValueNumeric(0));

    for (String kw : kws) {
      sortOptionBuilder
          .addSortExpression(
              SortExpression.newBuilder()
                  .setExpression("snippet(title, " + kw + ")")
                  .setDirection(SortExpression.SortDirection.ASCENDING)
                  .setDefaultValueNumeric(0))
          .addSortExpression(
              SortExpression.newBuilder()
                  .setExpression("snippet(description, " + kw + ")")
                  .setDirection(SortExpression.SortDirection.ASCENDING)
                  .setDefaultValueNumeric(0));
    } */

    /* Query<Entity> query = Query.newEntityQueryBuilder().setKind("Post").build();
    QueryResults<Entity> all_posts = datastore.run(query);

    while (post_matches.hasNext()) {
      Entity temp_post = post_matches.next();
      System.out.println("-------------------");
      System.out.println(temp_post.getString("user_id"));
      System.out.println(temp_post.getString("title"));
      System.out.println(temp_post.getString("description"));
      System.out.println(temp_post.getString("address"));
      System.out.println(temp_post.getString("lat"));
      System.out.println(temp_post.getString("lng"));
      System.out.println(temp_post.getString("pay"));
    } */
  }
}
