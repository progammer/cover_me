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

    long id = Long.parseLong(request.getParameter("id"));
    Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    KeyFactory keyFactory = datastore.newKeyFactory().setKind("Post");
    Key postKey = keyFactory.newKey(id);
    Entity posting = datastore.get(postKey);
    if (posting == null) return;

    /* TODO: handle entity not found */

    request.setAttribute("title", posting.getString("title"));
    request.setAttribute("description", posting.getString("description"));
    String pay = posting.getString("pay");
    try {
      double amt = Double.parseDouble(pay);
      DecimalFormat df = new DecimalFormat("#.00");
      request.setAttribute("pay", df.format(amt));
    } catch (NumberFormatException e) {
      request.setAttribute("pay", "Negotiable");
    }

    request.setAttribute("category", posting.getString("category"));
    request.setAttribute("email", posting.getString("email"));
    request.setAttribute("phone", posting.getString("phone"));
    request.setAttribute("address", posting.getString("address"));
    System.out.println(posting.getString("address"));

    String redirectURL = "/jsp/view_job.jsp";
    request.getRequestDispatcher(redirectURL).forward(request, response);
  }
}
