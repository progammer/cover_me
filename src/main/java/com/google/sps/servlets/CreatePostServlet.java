package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
@WebServlet("/create_post")
public class CreatePostServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    /* String user_id = request.getParameter("user_id"); */

    UserService userService = UserServiceFactory.getUserService();
    String email = userService.getCurrentUser().getEmail();

    String title = request.getParameter("title");
    String description = request.getParameter("description");
    String category = request.getParameter("category");
    String address = request.getParameter("address");
    String lat = request.getParameter("lat");
    String lng = request.getParameter("lng");
    String pay = request.getParameter("pay");
    String phone = request.getParameter("phone");

    Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    KeyFactory keyFactory =
        datastore
            .newKeyFactory()
            /* .addAncestors(PathElement.of("User", user_id)) */
            .setKind("Post");
    Key job_posting_key = datastore.allocateId(keyFactory.newKey());

    Entity posting =
        Entity.newBuilder(job_posting_key)
            .set("user_id", email)
            .set("title", title)
            .set("description", description)
            .set("category", category)
            .set("address", address)
            .set("lat", Double.parseDouble(lat))
            .set("lng", Double.parseDouble(lng))
            .set("pay", pay)
            .set("email", email)
            .set("phone", phone)
            .set("id", job_posting_key.getId())
            .build();

    datastore.put(posting);

    /* Entity retrieved = datastore.get(job_posting_key);
    System.out.println("-------------------");
    System.out.println(retrieved.getString("user_id"));
    System.out.println(retrieved.getString("title"));
    System.out.println(retrieved.getString("description"));
    System.out.println(retrieved.getString("address"));
    System.out.println(retrieved.getDouble("lat"));
    System.out.println(retrieved.getDouble("pay"));
    System.out.println(job_posting_key);
    System.out.println("-------------------");

    long id = job_posting_key.getId();
    Key test = keyFactory.newKey(id);
    System.out.println(datastore.get(test)); */

    /* Query<Entity> query =
        Query.newEntityQueryBuilder()
            .setKind("Post")
            .setFilter(
                PropertyFilter.hasAncestor(
                    datastore.newKeyFactory().setKind("User").newKey(user_id)))
            .build();
    QueryResults<Entity> user_posts = datastore.run(query);

    while (user_posts.hasNext()) {
        Entity temp_post = user_posts.next();
        System.out.println("-------------------");
        System.out.println(temp_post.getString("user_id"));
        System.out.println(temp_post.getString("title"));
    } */

    response.setContentType("html/text");
    response.getWriter().println(job_posting_key.getId());
  }
}
