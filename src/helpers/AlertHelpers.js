import Swal from "sweetalert2";

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
})

export const AlertError = (obj = {
    title: "Xảy ra lỗi.",
    errorTitle: "Không thể thao tác.",
    error: "Lỗi không mong muốn."
}, callback) => {
    const { title, errorTitle, error } = obj;
    return swalWithBootstrapButtons.fire({
        icon: 'error',
        title: title,
        html: `<div><div>${errorTitle}</div></div>`,
        footer: `<div class="text-danger font-size-xs line-height-lg font-weight-bold mt-2 text-center">Error : ${error}</div>`
    }).then(() => callback && callback())
}