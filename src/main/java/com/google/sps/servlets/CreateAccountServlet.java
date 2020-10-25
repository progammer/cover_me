package com.google.sps.servlets;

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
@WebServlet("/create_account")
public class CreateAccountServlet extends HttpServlet {

    // NOTE: NOT USED
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String username = request.getParameter("username");
    String password = request.getParameter("password");
    String email = request.getParameter("email");
    String phone = request.getParameter("phone");

    Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    KeyFactory keyFactory = datastore.newKeyFactory().setKind("User");
    Key account_key = datastore.allocateId(keyFactory.newKey());

    Entity account =
        Entity.newBuilder(account_key)
            .set("username", username)
            .set("password", password)
            .set("email", email)
            .set("phone", phone)
            .build();

    datastore.put(account);

    /* Entity retrieved = datastore.get(account_key);
    System.out.println(retrieved.getString("username"));
    System.out.println(retrieved.getString("password"));
    System.out.println(retrieved.getString("email"));
    System.out.println(retrieved.getString("phone")); */

    response.setContentType("html/text");
    response.getWriter().println(account_key.getId());
  }
}
