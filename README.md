# Website Cửa Hàng Điện Nước XYZ

Đây là mã nguồn cho website tĩnh của Cửa Hàng Điện Nước XYZ, được xây dựng bằng HTML, CSS và JavaScript thuần. Điểm đặc biệt của website này là toàn bộ nội dung (thông tin sản phẩm, giới thiệu, liên hệ, menu...) được quản lý thông qua các file JSON trong thư mục `/data`, giúp việc cập nhật trở nên dễ dàng mà không cần chỉnh sửa trực tiếp mã HTML.

## Cấu trúc thư mục

```
/diennuoc_xyz_site
├── css/
│   └── style.css         # File CSS chính cho giao diện
├── data/
│   ├── site.json         # Thông tin chung (tiêu đề, mô tả, keywords)
│   ├── header.json       # Dữ liệu cho header (logo, menu)
│   ├── footer.json       # Dữ liệu cho footer (liên hệ, social, copyright)
│   ├── products.json     # Danh sách sản phẩm (ID, tên, giá, mô tả, ảnh, category...)
│   ├── about.json        # Nội dung trang giới thiệu
│   └── contact.json      # Nội dung trang liên hệ (thông tin, form, map)
├── images/
│   ├── products/         # Chứa ảnh sản phẩm (đặt tên file tương ứng trong products.json)
│   └── about/            # Chứa ảnh cho trang giới thiệu
│   └── placeholder.png   # Ảnh mặc định nếu sản phẩm chưa có ảnh
├── js/
│   └── script.js         # File JavaScript chính xử lý logic, fetch JSON, render nội dung
├── index.html            # Trang chủ
├── products.html         # Trang danh sách sản phẩm
├── about.html            # Trang giới thiệu
├── contact.html          # Trang liên hệ
└── README.md             # File hướng dẫn này
```

## Cập nhật nội dung

Để thay đổi nội dung hiển thị trên website, bạn chỉ cần chỉnh sửa các file `.json` trong thư mục `/data` bằng một trình soạn thảo văn bản (như Notepad++, VS Code, Sublime Text...). **Lưu ý:** Cần giữ đúng cấu trúc JSON (dấu ngoặc {}, dấu ngoặc [], dấu phẩy ,, dấu hai chấm :, dấu ngoặc kép "") để tránh lỗi.

*   **Thông tin chung (Tiêu đề trang, Mô tả SEO):** Mở file `data/site.json` và chỉnh sửa các giá trị `site_title`, `description`, `keywords`.
*   **Header (Logo, Menu):** Mở file `data/header.json`.
    *   Để thay đổi logo dạng chữ, sửa `text` trong `logo`. Để dùng logo ảnh, đổi `type` thành `"image"` và cung cấp đường dẫn trong `image_url`.
    *   Để thay đổi menu, sửa các mục trong mảng `navigation` (thêm/bớt/sửa `label` và `link`).
*   **Footer (Thông tin liên hệ, Mạng xã hội, Chính sách):** Mở file `data/footer.json` và chỉnh sửa các mục tương ứng.
*   **Sản phẩm:** Mở file `data/products.json`.
    *   Mỗi sản phẩm là một object trong mảng `products`.
    *   **Thêm sản phẩm:** Copy một object sản phẩm mẫu, dán vào cuối mảng (trước dấu `]` đóng mảng), sửa lại thông tin (`id` phải là duy nhất, `name`, `category`, `description`, `price`, `image`, `features`...). Đặt ảnh sản phẩm vào thư mục `images/products/` và cập nhật đường dẫn trong trường `image`.
    *   **Sửa sản phẩm:** Tìm object sản phẩm cần sửa theo `id` hoặc `name` và chỉnh sửa các trường.
    *   **Xóa sản phẩm:** Xóa toàn bộ object của sản phẩm đó (từ dấu `{` mở đến dấu `}` đóng, bao gồm cả dấu phẩy `,` nếu có ở sau).
    *   `is_featured: true` để hiển thị ở slider trang chủ.
    *   `is_new: true` để hiển thị ở mục "Sản phẩm mới nhất" trang chủ.
*   **Trang Giới thiệu:** Mở file `data/about.json` và chỉnh sửa nội dung các `sections`.
*   **Trang Liên hệ:** Mở file `data/contact.json` để sửa thông tin liên hệ, tiêu đề form, và link nhúng Google Map (`google_map_iframe_src`).

**Quan trọng:** Sau khi chỉnh sửa file JSON, bạn cần tải lại trang web trên trình duyệt để thấy thay đổi. Nếu deploy lên hosting, có thể cần xóa cache trình duyệt.

## Hình ảnh

*   Ảnh sản phẩm nên được đặt trong thư mục `/images/products/`.
*   Ảnh cho trang giới thiệu đặt trong `/images/about/`.
*   Đảm bảo đường dẫn ảnh trong các file JSON (`image`, `image_url`) là chính xác (ví dụ: `"images/products/ten-san-pham.jpg"`).
*   Nên tối ưu kích thước ảnh trước khi tải lên để tăng tốc độ tải trang.

## Chạy và Kiểm thử Local

Do website sử dụng JavaScript để fetch (tải) các file JSON, việc mở trực tiếp file `index.html` từ thư mục trên máy tính **sẽ không hoạt động đúng** (trang có thể trắng hoặc thiếu nội dung) do các hạn chế bảo mật của trình duyệt.

Để kiểm thử local, bạn cần chạy một server HTTP đơn giản:

1.  **Cài đặt Python (nếu chưa có):** Tải và cài đặt Python từ [python.org](https://www.python.org/).
2.  **Mở Terminal/Command Prompt:**
    *   Trên Windows: Tìm "cmd" hoặc "PowerShell".
    *   Trên macOS/Linux: Mở Terminal.
3.  **Di chuyển đến thư mục gốc của website:** Dùng lệnh `cd` để điều hướng đến thư mục `diennuoc_xyz_site` (ví dụ: `cd C:\path\to\diennuoc_xyz_site`).
4.  **Chạy server:** Gõ lệnh sau và nhấn Enter:
    ```bash
    python -m http.server 8000 
    ```
    (Bạn có thể thay `8000` bằng một cổng khác nếu cổng đó đang bận).
5.  **Mở trình duyệt:** Truy cập địa chỉ `http://localhost:8000` (hoặc cổng bạn đã chọn).

**Lưu ý:** Một số server đơn giản (như `python -m http.server`) có thể không gửi đúng MIME type cho file JSON, đôi khi vẫn gây lỗi. Cách tốt nhất để đảm bảo mọi thứ hoạt động là deploy lên một nền tảng hosting tĩnh.

## Deploy Website

Website này hoàn toàn tĩnh và có thể dễ dàng deploy lên các nền tảng hosting miễn phí hoặc trả phí hỗ trợ web tĩnh như:

*   **Vercel:** Kéo thả thư mục dự án hoặc kết nối với kho Git (GitHub, GitLab, Bitbucket). Tự động build và deploy.
*   **Netlify:** Tương tự Vercel, hỗ trợ kéo thả hoặc kết nối Git.
*   **GitHub Pages:** Nếu bạn lưu trữ mã nguồn trên GitHub, có thể kích hoạt GitHub Pages để deploy trực tiếp từ kho lưu trữ.
*   **Cloudflare Pages:** Tương tự Vercel/Netlify.
*   **Các hosting truyền thống:** Tải toàn bộ nội dung thư mục `diennuoc_xyz_site` lên thư mục gốc (thường là `public_html` hoặc `www`) của hosting.

**Khuyến nghị:** Sử dụng Vercel hoặc Netlify để có trải nghiệm deploy đơn giản và đảm bảo các file JSON được phục vụ đúng cách.

Chúc bạn quản lý và phát triển website thành công!
