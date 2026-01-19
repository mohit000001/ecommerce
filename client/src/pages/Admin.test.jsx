import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Admin from "./Admin";
import * as api from "../api";

vi.mock("../api");

describe("Admin Page", () => {
  beforeEach(() => {
    api.fetchAdminStats.mockImplementation((type) => {
      const dataMap = {
        purchasedCount: { "Wireless Mouse": 3 },
        totalPurchasedAmount: 70000,
        listOfDiscountCodes: [{ code: "OFF50" }],
        totalDiscountAmount: 1500,
      };

      return Promise.resolve({
        data: {
          purchasedCount: dataMap.purchasedCount,
          totalPurchasedAmount: dataMap.totalPurchasedAmount,
          discountCodes: dataMap.listOfDiscountCodes,
          totalDiscountAmount: dataMap.totalDiscountAmount,
        },
      });
    });

    api.generateDiscount.mockResolvedValue({
      data: {
        data: { discountCoupon: "NEWCODE123" },
      },
    });
  });

  test("renders admin stats", async () => {
    render(<Admin />);

    expect(await screen.findByText("Wireless Mouse")).toBeInTheDocument();
    expect(await screen.getByText("70000")).toBeInTheDocument();
    expect(await screen.getByText("OFF50")).toBeInTheDocument();
  });

  test("generate discount code", async () => {
    render(<Admin />);

    fireEvent.change(screen.getByPlaceholderText("User Id"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByText("Generate Discount Code"));

    await waitFor(() =>
      expect(screen.getByText("NEWCODE123")).toBeInTheDocument(),
    );
  });
});
