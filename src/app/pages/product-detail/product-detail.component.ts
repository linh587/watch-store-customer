import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import SwiperCore, { FreeMode, Navigation, Pagination, Thumbs } from "swiper";
import { ProductsService } from "../../services/products/products.service";
import {
  createCloudinaryImageLink,
  createCloudinaryThumbLink,
} from "../../public/helpers/images.helper";
import { BehaviorSubject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CartService } from "../../services/cart/cart.service";
import { ToastrService } from "ngx-toastr";
import { Product, ProductSize } from "../../models/product.model";
import { RatingService } from "../../services/rating/rating.service";
import { Rating } from "../../models/rating.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalImageSliderComponent } from "../../components/modal-image-slider/modal-image-slider.component";
import { isPlatformBrowser } from "@angular/common";

SwiperCore.use([FreeMode, Navigation, Thumbs, Pagination]);

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit {
  public createCloudinaryThumbLink = createCloudinaryThumbLink;
  public createCloudinaryImageLink = createCloudinaryImageLink;
  public thumbsSwiper: any;
  public slidesPerView: number = 4;
  public id!: string;
  public productItem!: any;
  public active = 1;
  public productPrices$ = new BehaviorSubject<any[]>([]);
  public productSizes$ = new BehaviorSubject<ProductSize[]>([]);
  public selectedPrice: any;
  public selectedSize!: string;
  public addToCartForm!: FormGroup;
  public products: Product[] = [];
  public highPopularProduct: Product[] = [];
  public ratingForm!: FormGroup;
  public listRating: Rating[] = [];

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private fb: FormBuilder,
    private cartService: CartService,
    private toastService: ToastrService,
    private ratingService: RatingService,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.subscribeParamChange();
    this.getListProductPrice();
    this.getProductSizes();
    this.initForm();
    this.getListProduct();
    this.getHighPopularProduct();
    this.scrollToTop();
  }

  private scrollToTop() {
    if (isPlatformBrowser(this.platformId)) window.scrollTo(0, 0);
  }

  private getHighPopularProduct() {
    this.productsService
      .getProducts({
        sort: "highPopular",
        includes: "images",
      })
      .subscribe((res) => {
        const newProduct = res.data.slice(0, 10);

        this.highPopularProduct = newProduct;
      });
  }

  private getListProduct() {
    this.productsService
      .getProducts({
        includes: "images",
      })
      .subscribe((res) => {
        this.products = res.data.slice(0, 10);
      });
  }

  private initForm() {
    this.addToCartForm = this.fb.group({
      quantity: [1, Validators.required],
    });

    this.ratingForm = this.fb.group({
      productId: [this.id, Validators.required],
      star: ["", Validators.required],
      content: [""],
    });
  }

  private subscribeParamChange() {
    this.id = this.getProductId();
    this.getProductItem(this.id);
    this.getRatingsOfProduct(this.id);

    this.route.params.subscribe((param) => {
      const { id } = param;
      if (id && id !== this.id) {
        this.getProductItem(id);
        this.getRatingsOfProduct(id);
      } else this.id = id;
    });
  }

  private getProductId() {
    const { id } = this.route.snapshot.params;
    return id || "";
  }

  private getProductItem(id: string) {
    this.productsService
      .getDetailProduct(id, {
        includes: "images",
      })
      .subscribe((res: any) => {
        this.productItem = res;
      });
  }

  private getProductSizes() {
    let productSizes: any = [];
    this.productPrices$.subscribe((prices) => {
      prices.forEach((price) => {
        productSizes.push({
          id: price.productSizeId,
          name: price.productSizeName,
          price: price.price,
          priceId: price.id,
        });

        this.productSizes$.next(productSizes);
        this.selectedPrice = {
          price: productSizes[0].price,
          id: productSizes[0].priceId,
        };

        this.selectedSize = productSizes[0].name;
      });
    });
  }

  public onSizeChange(size: any) {
    this.selectedPrice = {
      price: size?.price,
      id: size?.priceId,
    };
    this.selectedSize = size.name;
  }

  public onAddToCart() {
    if (this.addToCartForm.valid && this.selectedPrice?.id) {
      const payload = {
        productPriceId: this.selectedPrice.id,
        quality: this.addToCartForm.controls["quantity"].value,
      };
      this.cartService.addToCart(payload);
    } else {
      this.toastService.info("Vui lòng chọn size sản phẩm");
    }
  }

  public openSliderImage(event: any, images: any[]) {
    const swiper = event[0];

    if (swiper) {
      const modalRef = this.modalService.open(ModalImageSliderComponent, {
        size: "lg",
        centered: true,
        windowClass: "customize-slider-image",
      });

      modalRef.componentInstance.images = images;
      modalRef.componentInstance.currentSlide = Number(swiper?.activeIndex);
    }
  }

  private getListProductPrice() {
    this.productsService.getProductPrices().subscribe((res: any) => {
      let productPrices = res.filter((p: any) => p?.productId === this.id);
      this.productPrices$.next(productPrices);
    });
  }

  private getRatingsOfProduct(id: string) {
    this.ratingService.getRatingsOfProduct(id).subscribe((res: any) => {
      this.listRating = res.data;
    });
  }
}
