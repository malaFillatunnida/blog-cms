import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import { Card, Form, Col, Button, Row } from "react-bootstrap";
import SideBar from "../SideBar.js";
import NavBar from "../NavBar.js";

const EditCategories = () => {
  window.addEventListener("DOMContentLoaded", (event) => {
    const sidebarToggle = document.body.querySelector("#sidebarToggle");
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", (event) => {
        event.preventDefault();
        document.body.classList.toggle("sidebar-toggle");
      });
    }
  });
  const [, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const history = useHistory();

  useEffect(() => {
    refreshToken();
  });

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        history.push("/");
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return (
    <div className="d-flex bungkus">
      <SideBar />
      <div className="konten-bungkus">
        <NavBar />
        {/* Page Konten */}
        <div className="container-fluid pb-4">
          <Card className="shadow">
            <div className="card-header">
              <h4
                style={{
                  float: "left",
                }}
              >
                Edit Kategori
              </h4>
            </div>

            <Form
              style={{
                padding: "10px",
              }}
            >
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="2">
                  Judul Kategori
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    placeholder="Judul Kategori..."
                    required
                  />
                </Col>
              </Form.Group>

              <Col>
                <Button
                  variant="outline-dark"
                  style={{
                    float: "right",
                  }}
                  className="fw-bold"
                >
                  SIMPAN
                </Button>
                {/* <Button
                    variant="outline-dark"
                    style={{
                      float: "right",
                    }}
                    type="submit"
                    className="fw-bold me-2"
                  >
                    <i className="fa fa-trash me-2" aria-hidden="true"></i>
                    DELETE
                  </Button> */}
              </Col>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditCategories;