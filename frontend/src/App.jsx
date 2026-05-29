import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ConsumerFeed from "./pages/ConsumerFeed.jsx";
import MediaView from "./pages/MediaView.jsx";
import CreatorUpload from "./pages/CreatorUpload.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ConsumerFeed />} />
        <Route path="/media/:id" element={<MediaView />} />
        <Route path="/creator/upload" element={<CreatorUpload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Layout>
  );
}
