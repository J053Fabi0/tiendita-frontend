import theme from "./styles/theme";
import Home from "./views/Home/Home";
import { Navbar } from "./components";
import Sales from "./views/Sales/Sales";
import Products from "./views/Products/Products";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import { SalesProvider } from "./context/salesContext";
import { PersonProvider } from "./context/personContext";
import { PersonsProvider } from "./context/personsContext";
import { ProductsProvider } from "./context/productsContext";
import { TagsAndCategoriesProvider } from "./context/tagsAndCategoriesContext";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <PersonProvider>
        <ProductsProvider>
          <SalesProvider>
            <PersonsProvider>
              <TagsAndCategoriesProvider>
                <BrowserRouter>
                  <Navbar
                    links={[
                      { path: "/", title: "Ventas" },
                      { path: "/productos", title: "Productos", onlyAdmins: true },
                      { path: "/ventas", title: "Ventas", onlyAdmins: true },
                    ]}
                  />

                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/productos" element={<Products />} />
                    <Route path="/ventas" element={<Sales />} />

                    <Route path="*" element={<Home />} />
                  </Routes>
                </BrowserRouter>
              </TagsAndCategoriesProvider>
            </PersonsProvider>
          </SalesProvider>
        </ProductsProvider>
      </PersonProvider>
    </ThemeProvider>
  );
}
