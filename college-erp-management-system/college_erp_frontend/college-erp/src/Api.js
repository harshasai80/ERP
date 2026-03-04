import axios from "axios";

const APIUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://103.44.2.245:8080";

const Api = axios.create({
  baseURL: APIUrl,
});

export default Api;




