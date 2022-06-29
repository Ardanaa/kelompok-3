import React, { useState, useEffect } from 'react';
import { Button, Container, Stack, Row, Col, Card } from 'react-bootstrap';
import { NavbarLogin } from "../components/navbar";
import { FiBox, FiHeart, FiDollarSign, FiChevronRight } from "react-icons/fi";
import Profile from '../assets/images/profile.png'
import { Navigate } from 'react-router-dom';
import axios from "axios";
import "../css/daftarJual.css"

export default function DaftarJual() {
  const [post, setPost] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({});
  useEffect(() => {
    const validateLogin = async () => {
      try {
        // Check status user login
        // 1. Get token from localStorage
        const token = localStorage.getItem("token");

        // 2. Check token validity from API
        const currentUserRequest = await axios.get(
          "http://localhost:2000/v1/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const currentUserResponse = currentUserRequest.data;

        if (currentUserResponse.status) {
          setUser(currentUserResponse.data.user);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    validateLogin();
  }, []);

  useEffect(() => {
    const postData = async () => {
      const response = await axios.get(`http://localhost:2000/v1/products/search`);
      console.log(response);
      const data = await response.data.data.handle_get_all_product;
      console.log(data);

      setPost(data);
    };
    postData();
  }, []);

  return isLoggedIn ? (<>
    <NavbarLogin></NavbarLogin>;
    <Container style={{ padding: "0px 110px" }}>
      <p className="fw-bold fs-3">Daftar Jual Saya</p>
      <div className=" radius-primary box-shadow p-2">
        <Stack direction="horizontal" gap={3}>
          <img src={`http://localhost:2000/public/files/${user.picture}`} alt="" 
          style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius:"12px" }} />
          <Stack>
            <p className="m-0 fw-bold">{user.name}</p>
            <p className="m-0 text-black-50">{user.city}</p>
          </Stack>
          <Button className="ms-auto radius-secondary bg-white text-black border-purple">Edit</Button>
        </Stack>
      </div>
      <div className="d-flex flex-row mt-3">
        <div>
          <Card id="daftar-jual" classname="radius-primary" style={{ width: '248px' }}>
            <Card.Body>
              <p className="fw-bold">Kategori</p>
              <Button variant="light" className="bg-transparent border-0 w-100 text-start active">
                <FiBox /> Semua Produk <FiChevronRight className="" />
              </Button>
              <hr className="m-1"></hr>
              <Button variant="light" className="bg-transparent border-0 w-100 text-start">
                <FiHeart /> Diminati <FiChevronRight className="" />
              </Button>
              <hr className="m-1"></hr>
              <Button variant="light" className="bg-transparent border-0 w-100 text-start">
                <FiDollarSign /> Terjual <FiChevronRight className="" />
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className=" flex-fill ms-2">
          <Row className="" >
            {post.map((post) =>
              <Col md={4} key={post.id} className="">
                <Card >
                  <Card.Img variant="top" className="p-2" src={`http://localhost:2000/public/files/${post.picture}`} style={{ maxHeight: "100px", objectFit: "cover" }} />
                  <Card.Body>
                    <Card.Title className="fs-7 cut-text">{post.name}</Card.Title>
                    <p className="text-black-50">{post.category}</p>
                    <Card.Text>{post.price}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </Container>
  </>) : (
    <Navigate to="/login" replace />
  )
}