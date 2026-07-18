import { Toaster } from "react-hot-toast";
import Dashboard from "./Dashboard";

export default function App() {
  return <><Dashboard /><Toaster position="top-right" toastOptions={{ duration: 4000 }} /></>;
}
