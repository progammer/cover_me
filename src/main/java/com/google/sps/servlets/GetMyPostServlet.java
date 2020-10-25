package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
@WebServlet("/my_posts")
public class GetMyPostServlet extends HttpServlet {

  // which method you call depends on fetch method (ex. method = GET  or method = POST in the
  // javascript code)
  // default method is get
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    UserService userService = UserServiceFactory.getUserService();
    String user_id = "";
    if (userService.isUserLoggedIn()) {
      user_id = userService.getCurrentUser().getUserId();
    }
    Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
    Query<Entity> query =
        Query.newEntityQueryBuilder()
            .setKind("Post")
            .setFilter(
                PropertyFilter.hasAncestor(
                    datastore.newKeyFactory().setKind("User").newKey(user_id)))
            .build();
    QueryResults<Entity> user_posts = datastore.run(query);

    ArrayList<MyPost> posts = new ArrayList<>();
    while (user_posts.hasNext()) {
      Entity temp_post = user_posts.next();
      String title = temp_post.getString("title");
      String description = temp_post.getString("description");
      double lat = temp_post.getDouble("lat");
      double lng = temp_post.getDouble("lng");
      String price = temp_post.getString("price");
      MyPost newPost = new MyPost(title, description, lat, lng, price);
      posts.add(newPost);
    }

    Gson gson = new Gson();
    response.setContentType("application/json");
    response.getWriter().println(gson.toJson(posts));
  }

  private static class MyPost {
    // helps w/ json parsing
    String title;
    String description;
    double lat;
    double lng;
    String price;

    public MyPost(String title, String description, double lat, double lng, String price) {
      this.title = title;
      this.description = description;
      this.lat = lat;
      this.lng = lng;
      this.price = price;
    }
  }
}
