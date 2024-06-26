import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../../services/products/products.service";
import { PRODUCT_SORT } from "../../public/constants/common";
import { Product } from "../../models/product.model";
import { Response } from "../../models/common.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public highPopularProduct: Product[] = [];
  public PRODUCT_SORT = PRODUCT_SORT;
  public productListSort: Product[] = [];
  public activeKey: string | undefined;

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.getListProduct();
    this.getHighPopularProduct();
    this.activeKey = this.PRODUCT_SORT[0].key;
  }

  private getListProduct() {
    this.productsService
      .getProducts({
        includes: "images, priceAndSize",
      })
      .subscribe((res: Response) => {
        this.productListSort = res.data.slice(0, 10);
      });
  }

  public getHighPopularProduct() {
    this.productsService
      .getProducts({
        sort: "highPopular",
        includes: "images, priceAndSize",
      })
      .subscribe((res) => {
        const newProduct = res.data.slice(0, 10);

        this.highPopularProduct = newProduct;
      });
  }

  public sortProductByText(text?: string) {
    this.activeKey = text;
    this.productsService
      .getProducts({
        sort: text || "highRating",
      })
      .subscribe((res) => {
        this.productListSort = res.data.slice(0, 10);
      });
  }
}
