import theme from "./styles/theme";
import Home from "./views/Home/Home";
import { Navbar } from "./components";
import Sales from "./views/Sales/Sales";
import { ThemeProvider } from "@emotion/react";
import Products from "./views/Products/Products";
import { PersonProvider } from "./context/personContext";
import { ProductsProvider } from "./context/productsContext";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { TagsAndCategoriesProvider } from "./context/tagsAndCategoriesContext";
import { SalesProvider } from "./context/salesContext";
import { PersonsProvider } from "./context/personsContext";

export default function App() {
  return (
    <PersonProvider>
      <ProductsProvider>
        <TagsAndCategoriesProvider>
          <SalesProvider>
            <PersonsProvider>
              <ThemeProvider theme={theme}>
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
              </ThemeProvider>
            </PersonsProvider>
          </SalesProvider>
        </TagsAndCategoriesProvider>
      </ProductsProvider>
    </PersonProvider>
  );
}
