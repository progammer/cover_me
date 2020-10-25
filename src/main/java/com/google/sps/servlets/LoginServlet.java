package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
@WebServlet(name = "UserAPI", urlPatterns = "/login")
public class LoginServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    UserService userService = UserServiceFactory.getUserService();
    String url = "/";
    String action = "logout";
    String id = "";
    String email = "";
    if (userService.isUserLoggedIn()) {
      url = userService.createLogoutURL(url);
      id = userService.getCurrentUser().getUserId();
      email = userService.getCurrentUser().getEmail();
    } else {
      url = userService.createLoginURL(url);
      action = "login";
    }
    Gson gson = new Gson();
    resp.setContentType("application/json");
    resp.getWriter().println(gson.toJson(new AuthObj(action, url, id, email)));
  }

  private static class AuthObj {
    // helps w/ json parsing
    String action;
    String url;
    String id;
    String email;

    public AuthObj(String action, String url, String id, String email) {
      this.action = action;
      this.url = url;
      this.id = id;
      this.email = email;
    }
  }
}
