import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
	selector: 'app-loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

	constructor(private loaderService: LoaderService) { }

	ngOnInit(): void {
		//const loaderWrapper : HTMLDivElement = document.getElementById('loaderWrapper') as HTMLDivElement;
		const loaderWrapper = document.getElementById('loaderWrapper')!;
		const loadMainContainer = document.getElementById('loadMainContainer')!;

		this.loaderService.$showLoader.subscribe(value => {
			if (!value) {
				setTimeout(() => {
					loaderWrapper.classList.add('loader-wrapper-ready');
					setTimeout(() => {
						loadMainContainer.classList.add('loader-main-container-hide');
					}, 500);
					setTimeout(()=> {
						this.loaderService.$loaderState.emit(false);
					}, 1500)
				}, 20);
			}
		});
	}
}