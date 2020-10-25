package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreException;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
@WebServlet("/delete")
public class DeleteServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
      throws IOException, ServletException {

    long id = Long.parseLong(request.getParameter("id"));
    Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    KeyFactory keyFactory = datastore.newKeyFactory().setKind("Post");
    Key postKey = keyFactory.newKey(id);
    try {
      Entity posting = datastore.get(postKey);
      UserService userService = UserServiceFactory.getUserService();
      if (posting != null
          && userService.isUserLoggedIn()
          && userService.getCurrentUser().getEmail().equals(posting.getString("user_id"))) {
        datastore.delete(postKey);
      }

    } catch (DatastoreException e) {
      // do nothing
    }
  }
}
