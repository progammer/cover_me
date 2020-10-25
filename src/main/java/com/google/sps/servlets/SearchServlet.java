package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/search")
public class SearchServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    /* int r = Integer.parseInt(request.getParamter("radius")); */
    String[] kws = request.getParameter("keywords").split(",");
    double lat = Double.parseDouble(request.getParameter("lat"));
    double lng = Double.parseDouble(request.getParameter("lng"));
    int r = Integer.parseInt(request.getParameter("radius"));

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

    response.setContentType("html/text");
    response.getWriter().println("lat: " + lat + "\nr: " + r);
  }
}
