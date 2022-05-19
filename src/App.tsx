import theme from "./styles/theme";
import Home from "./views/Home/Home";
import { Navbar } from "./components";
import Sales from "./views/Sales/Sales";
import { ThemeProvider } from "@emotion/react";
import Products from "./views/Products/Products";
import { PersonsProvider } from "./context/personContext";
import { ProductsProvider } from "./context/productsContext";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { TagsAndCategoriesProvider } from "./context/tagsAndCategoriesContext";
import { SalesProvider } from "./context/salesContext";

export default function App() {
  return (
    <PersonsProvider>
      <ProductsProvider>
        <TagsAndCategoriesProvider>
          <SalesProvider>
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
          </SalesProvider>
        </TagsAndCategoriesProvider>
      </ProductsProvider>
    </PersonsProvider>
  );
}
