import type { RunInput, FunctionRunResult } from "../generated/api";
import { DiscountApplicationStrategy } from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input: RunInput): FunctionRunResult {
  let qualifyCount = 0;
  let qualifyProductType = ["Skis", "Snowboards"]; // Will update to "Club Family", "Club Set"
  let applyDiscount = false;
  let discountAmount = 0;

  for (const line of input.cart.lines) {
    if (line._count && line._count.value && Number(line._count.value) > 0) {
      qualifyCount += Number(line._count.value);
    } else if (
      line.merchandise.__typename === "ProductVariant" &&
      line.merchandise.product.productType &&
      qualifyProductType.includes(line.merchandise.product.productType)
    ) {
      qualifyCount += line.quantity;
    }
  }

  // If qualifyCount is
  // - 7-9, 15% discount
  // - 10-13, 18% discount
  // - 14+, 20% discount
  if (qualifyCount >= 7 && qualifyCount <= 9) {
    console.log("---7-9 DISCOUNT:", qualifyCount);
    discountAmount = 15;
    applyDiscount = true;
  } else if (qualifyCount >= 10 && qualifyCount <= 13) {
    console.log("---10-13 DISCOUNT:", qualifyCount);
    discountAmount = 18;
    applyDiscount = true;
  } else if (qualifyCount >= 14) {
    console.log("---14+ DISCOUNT:", qualifyCount);
    discountAmount = 20;
    applyDiscount = true;
  }

  console.log("---RESULTS:", qualifyCount, `${discountAmount}%`, applyDiscount);

  if (!applyDiscount) {
    console.error("Does not qualify for best value discount.");
    return EMPTY_DISCOUNT;
  }

  // TODO: filter out lines that don't get discount. Based on collection?
  const targets = input.cart.lines.map((line) => {
    return {
      cartLine: {
        id: line.id,
      },
    };
  });

  return {
    discounts: [
      {
        message: `Best value, ${discountAmount}% off`,
        targets,
        value: {
          percentage: {
            value: discountAmount,
          },
        },
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
