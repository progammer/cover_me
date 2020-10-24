package main.java.com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/servlet")
public class Servlet extends HttpServlet {

  // which method you call depends on fetch method (ex. method = GET  or method = POST in the
  // javascript code)
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    response.setContentType("application/json");
    response.getWriter().println("this is the output from the servlet");
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    Object o = request.getParameter("param");
    response.setContentType("html/text");
    response.getWriter().println("this is the output from the servlet");
  }
}
