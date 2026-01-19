import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Shop from "./Shop";
import * as api from "../api";

vi.mock("../api");

describe("Shop Page", () => {
  beforeEach(() => {
    api.fetchProducts.mockResolvedValue({
      data: {
        products: [
          { id: 1, name: "Wireless Mouse", price: 10000 },
          { id: 2, name: "Mechanical Keyboard", price: 50000 },
        ],
      },
    });

    api.addToCart.mockResolvedValue({});
    api.checkout.mockResolvedValue({
      json: async () => ({
        data: {},
      }),
    });
  });

  test("renders products as cards", async () => {
    render(
      <BrowserRouter>
        <Shop />
      </BrowserRouter>,
    );

    expect(await screen.findByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
  });

  test("increase and decrease quantity", async () => {
    render(
      <BrowserRouter>
        <Shop />
      </BrowserRouter>,
    );

    await screen.findByText("Wireless Mouse");

    fireEvent.click(screen.getAllByText("+")[0]);
    expect(screen.getAllByText("2")[0]).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("-")[0]);
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();
  });

  test("add to cart shows toast", async () => {
    render(
      <BrowserRouter>
        <Shop />
      </BrowserRouter>,
    );

    await screen.findByText("Wireless Mouse");
    fireEvent.click(screen.getAllByText("Add to Cart")[0]);

    await waitFor(() =>
      expect(screen.getByText("Item added to cart")).toBeInTheDocument(),
    );
  });

  test("checkout success toast", async () => {
    render(
      <BrowserRouter>
        <Shop />
      </BrowserRouter>,
    );

    await screen.findByText("Checkout");
    fireEvent.click(screen.getByText("Checkout"));

    await waitFor(() =>
      expect(screen.getByText(/Checkout successful/i)).toBeInTheDocument(),
    );
  });
});
