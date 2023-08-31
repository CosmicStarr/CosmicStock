import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { IProducts } from 'src/app/Models/products';
import { ProductsService } from 'src/app/products/products.service';
import { AdminServiceService } from '../admin-service.service';

@Component({
  selector: 'app-admindash',
  templateUrl: './admindash.component.html',
  styleUrls: ['./admindash.component.scss']
})
export class AdmindashComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<IProducts>;
  dataSource: MatTableDataSource<IProducts> = null;
  // sun:SunParams
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name','description','price','isOnSale','isAvailable','category','brand','actions'];
  amount:number
  isLoading:boolean = false
  loadingStatus:string = "Loading";
  isError:boolean = false
  searchForm:FormGroup
  constructor(private adminService:AdminServiceService,private productService:ProductsService,private route:ActivatedRoute,private Formbuilder:FormBuilder) {
  }
  ngOnInit(): void {
    this.getData()
    this.searchForm = this.Formbuilder.group({
      search:this.Formbuilder.control('')
    })
  }

  deleteProduct(id:number){
    let info = confirm('are you sure?')
    if(info.valueOf()) this.adminService.deleteProduct(id).subscribe({
      next:(x)=>console.log(x)
    })
  }

  
  getData(){
    this.productService.getProducts().subscribe({
      next:(results)=>{
        this.dataSource = new MatTableDataSource<IProducts>(results.result)
        if(this.dataSource?.sort !== null || this.dataSource?.paginator !== null){
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort; 
        }
        this.amount = results.result.length
        this.isLoading = true
  
        this.dataSource.filterPredicate = (data,filter) => {
          //...spread operater clones the data!
          let newData = {...data}
          if(filter){
            filter = filter.toLowerCase()
          }
          if(newData.name){
            newData.name = newData.name.toLowerCase()
          }
          if(newData.category){
            newData.category = newData.category.toLowerCase()
          }
          if(newData.brand){
            newData.brand = newData.brand.toLowerCase()
          }
          return newData.name.indexOf(filter) != -1 || newData.category.indexOf(filter) != -1 || newData.brand.indexOf(filter) != -1
        }
      },
      error:(x)=>{
        x.error.errors
      }
    })

  }

  filterSearch(){
    if(this.searchForm.value !== null && this.dataSource !== null)
    {
        this.dataSource.filter = this.searchForm.value.search.trim()
    }
  }

  clearSearch(){
    this.searchForm.patchValue({search:""})
    this.filterSearch()
  }
}
