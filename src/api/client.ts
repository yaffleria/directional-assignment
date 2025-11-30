import axios from "axios";
import { Auth } from "./Auth";
import { Posts } from "./Posts";
import { Mock } from "./Mock";
import { Health } from "./Health";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: "https://fe-hiring-rest-api.vercel.app",
});

// Function to set auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// Initialize token from localStorage on startup
const storedToken = localStorage.getItem("token");
if (storedToken) {
  setAuthToken(storedToken);
}

// Create API instance with all modules
class API {
  public auth: Auth;
  public posts: Posts;
  public mock: Mock;
  public health: Health;

  constructor() {
    this.auth = new Auth({ baseURL: "https://fe-hiring-rest-api.vercel.app" });
    this.posts = new Posts({
      baseURL: "https://fe-hiring-rest-api.vercel.app",
    });
    this.mock = new Mock({ baseURL: "https://fe-hiring-rest-api.vercel.app" });
    this.health = new Health({
      baseURL: "https://fe-hiring-rest-api.vercel.app",
    });

    // Share the same axios instance for auth token management
    this.auth.instance = axiosInstance;
    this.posts.instance = axiosInstance;
    this.mock.instance = axiosInstance;
    this.health.instance = axiosInstance;
  }
}

export const api = new API();
