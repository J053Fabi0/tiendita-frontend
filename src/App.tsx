import theme from "./styles/theme";
import Home from "./views/Home/Home";
import { Navbar } from "./components";
import SaleView from "./views/Sales/Sale/Sale";
import Sales from "./views/Sales/Sales";
import Products from "./views/Products/Products";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import { SalesProvider } from "./context/salesContext";
import { PersonProvider } from "./context/personContext";
import { ProductsProvider } from "./context/productsContext";
import { TagsAndCategoriesProvider } from "./context/tagsAndCategoriesContext";
import { SelectedThingsProvider } from "./context/selectedThingsContext";
import { PersonsProvider } from "./context/personsContext";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <PersonProvider>
        <ProductsProvider>
          <SelectedThingsProvider>
            <SalesProvider>
              <TagsAndCategoriesProvider>
                <PersonsProvider>
                  <BrowserRouter>
                    <Navbar
                      links={[
                        { path: "/", title: "Vender" },
                        { path: "/productos", title: "Productos", onlyAdmins: true },
                        { path: "/ventas", title: "Ventas", onlyAdmins: true },
                      ]}
                    />

                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/ventas" element={<Sales />} />
                      <Route path="/productos" element={<Products />} />
                      <Route path="/ventas/:id" element={<SaleView />} />

                      <Route path="*" element={<Home />} />
                    </Routes>
                  </BrowserRouter>
                </PersonsProvider>
              </TagsAndCategoriesProvider>
            </SalesProvider>
          </SelectedThingsProvider>
        </ProductsProvider>
      </PersonProvider>
    </ThemeProvider>
  );
}
