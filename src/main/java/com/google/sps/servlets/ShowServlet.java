package com.google.sps.servlets;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import java.io.IOException;
import java.text.DecimalFormat;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/show")
public class ShowServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
      throws IOException, ServletException {
    /* String user_id = request.getParameter("user_id"); */

    long id = Long.parseLong(request.getParameter("id"));
    Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    KeyFactory keyFactory = datastore.newKeyFactory().setKind("Post");
    Key postKey = keyFactory.newKey(id);
    // Entity posting = datastore.get(postKey);

    Entity posting =
        Entity.newBuilder(postKey)
            .set("user_id", "test@example")
            .set("title", "my job")
            .set("description", "lololol")
            .set("category", "poop")
            .set("address", "my address")
            .set("pay", 20.0)
            .set("email", "test@example")
            .set("phone", "41481249")
            .build();

    request.setAttribute("title", posting.getString("title"));
    request.setAttribute("description", posting.getString("description"));
    double amt = posting.getDouble("pay");
    DecimalFormat df = new DecimalFormat("#.00");
    request.setAttribute("pay", "$" + df.format(amt));

    request.setAttribute("category", posting.getString("category"));
    request.setAttribute("email", posting.getString("email"));
    request.setAttribute("phone", posting.getString("phone"));

    String redirectURL = "/jsp/view_job.jsp";
    System.out.println("FORWARDING");
    request.getRequestDispatcher(redirectURL).forward(request, response);

    // TODO: make an error not found page

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
      System.out.println(temp_post.getString("description"));
      System.out.println(temp_post.getString("address"));
      System.out.println(temp_post.getString("lat"));
      System.out.println(temp_post.getString("lng"));
      System.out.println(temp_post.getString("pay"));
    } */
  }
}
