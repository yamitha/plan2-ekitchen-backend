import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { Injectable } from '@angular/core';

@Injectable()
export class ToasterService {

    constructor(
        private toastyService: ToastyService,
        private toastConfig: ToastyConfig
    ) { }

    addToastSuccess(title, msg) {
        const toastOptions: ToastOptions = {
            title: title,
            msg: msg,
            showClose: true,
            timeout: 2000,
            theme: 'bootstrap'
        };

        this.toastyService.success(toastOptions);
    }

    addToastError(title, msg) {
        const toastOptions: ToastOptions = {
            title: title,
            msg: msg,
            showClose: true,
            timeout: 5000,
            theme: 'bootstrap'
        };

        this.toastyService.error(toastOptions);
    }

    addToastInfo(title, msg) {
        const toastOptions: ToastOptions = {
            title: title,
            msg: msg,
            showClose: true,
            timeout: 2000,
            theme: 'bootstrap'
        };

        this.toastyService.info(toastOptions);
    }
}
