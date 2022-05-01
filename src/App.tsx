import theme from "./styles/theme";
import Home from "./views/Home/Home";
import { Navbar } from "./components";
import { ThemeProvider } from "@emotion/react";
import Products from "./views/Products/Products";
import { PersonsProvider } from "./context/personContext";
import { ProductsProvider } from "./context/productsContext";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { TagsAndCategoriesProvider } from "./context/tagsAndCategoriesContext";

export default function App() {
  return (
    <PersonsProvider>
      <ProductsProvider>
        <TagsAndCategoriesProvider>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Navbar
                links={[
                  { path: "/", title: "Ventas" },
                  { path: "/productos", title: "Nuevo producto", onlyAdmins: true },
                ]}
              />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Products />} />

                <Route path="*" element={<Home />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </TagsAndCategoriesProvider>
      </ProductsProvider>
    </PersonsProvider>
  );
}
