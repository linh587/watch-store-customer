import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { PromotionDetailComponent } from "./promotion-detail/promotion-detail.component";
import { PromotionListComponent } from "./promotion-list/promotion-list.component";
import { NgxPaginationModule } from "ngx-pagination";

const routes: Routes = [
  { path: "", component: PromotionListComponent, pathMatch: "full" },
  {
    path: ":id",
    component: PromotionDetailComponent,
    pathMatch: "full",
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), NgxPaginationModule],
  declarations: [PromotionListComponent, PromotionDetailComponent],
})
export class PromotionsModule {}
