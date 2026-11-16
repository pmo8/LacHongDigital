/**
 * LẠC HỒNG DIGITAL - HỆ THỐNG SONG NGỮ TOÀN DIỆN VIỆT - ANH (VI | EN)
 * Tự động chuyển đổi mượt mà toàn bộ nội dung, tiêu đề, biểu mẫu, thuộc tính
 * và dữ liệu tương tác cho toàn bộ website lachongdigital.vn
 */

(function () {
  'use strict';

  // 1. TỪ ĐIỂN SONG NGỮ HOÀN CHỈNH CHO TOÀN BỘ WEBSITE
  const PHRASE_MAP = {
  "LẠC HỒNG DIGITAL | Viện Nghiên Cứu Chiến Lược Và Phát Triển Lạc Hồng": "LAC HONG DIGITAL | Lac Hong Institute of Strategic Research & Development",
  "Cổng thông tin chính thức": "Official Information Portal",
  "VIỆN NGHIÊN CỨU CHIẾN LƯỢC VÀ PHÁT TRIỂN LẠC HỒNG": "LAC HONG INSTITUTE OF STRATEGIC RESEARCH & DEVELOPMENT",
  "566 Quốc Lộ 13, khu phố 19, P. Hiệp Bình, TP.HCM": "566 National Route 13, Quarter 19, Hiep Binh Ward, HCMC",
  "0909.860.118 - Mr. William | 0967.326.847 - Ms. Hồng": "0909.860.118 - Mr. William | 0967.326.847 - Ms. Hong",
  "LẠC HỒNG": "LAC HONG",
  "Trang chủ": "Home",
  "Giới thiệu": "About Us",
  "Tổng quan Viện": "Institute Overview",
  "Tầm nhìn – Sứ mệnh": "Vision & Mission",
  "Giá trị cốt lõi": "Core Values",
  "Sơ đồ tổ chức": "Organization Chart",
  "Ban Lãnh đạo & Chuyên gia": "Leadership & Experts",
  "Thành tích & Chứng nhận": "Milestones & Credentials",
  "Lĩnh vực hoạt động": "Key Sectors",
  "Nghiên cứu Chiến lược & Thể chế": "Strategic & Institutional Research",
  "Quản trị Dự án Agile PMO": "Agile PMO Project Governance",
  "Tư vấn Thiết kế & BIM - CDE": "Design Consulting & BIM - CDE",
  "Quy hoạch & Hạ tầng Kỹ thuật": "Planning & Technical Infrastructure",
  "Đầu tư & Hợp tác Giải pháp Số": "Digital Investment & Solutions",
  "Đào tạo & Chuyển giao Năng lực": "Training & Capability Transfer",
  "Dự Án Tiêu Biểu": "Featured Projects",
  "Dự án tiêu biểu": "Featured Projects",
  "Tin tức": "News & Insights",
  "Sự kiện nổi bật": "Featured Events",
  "Bản tin nghiên cứu & Chuyên san": "Research Bulletin & Journals",
  "Bản tin nghiên cứu & Chuyển đổi số": "Research & Digital Transformation Bulletin",
  "Trách nhiệm xã hội (CSR)": "Corporate Social Responsibility (CSR)",
  "Đơn vị thành viên": "Member Units",
  "Liên hệ": "Contact Us",
  "Tư Vấn Dự Án": "Project Consultation",
  "TẬN TÂM VÌ": "DEVOTED TO",
  "GIÁ TRỊ BỀN VỮNG": "SUSTAINABLE VALUES",
  "– TIÊN PHONG TÍCH HỢP SỐ": "– PIONEERING DIGITAL INTEGRATION",
  "Khát vọng số – Nâng tầm trí tuệ Việt.": "Digital aspiration – Elevating Vietnamese intelligence.",
  "Chuyển đổi hôm nay – Tỏa sáng ngày mai.": "Transforming today – Illuminating tomorrow.",
  "Chuẩn hoá khung năng lực PMO tích hợp số (Agile PMO) và giải pháp Mô hình thông tin công trình BIM - CDE. Đồng hành cùng các tập đoàn xây dựng, đầu tư quy hoạch và quản lý dự án quy mô quốc gia.": "Standardizing Agile PMO digital capability frameworks and BIM - CDE Building Information Modeling solutions. Partnering with major construction corporations, urban planning developers, and national megaproject authorities.",
  "Khám Phá Năng Lực": "Explore Capabilities",
  "Kết Nối WhatsApp": "Connect on WhatsApp",
  "CHUẨN HÓA KHUNG NĂNG LỰC THỰC THI PMO 4.0": "STANDARDIZING PMO 4.0 IMPLEMENTATION CAPABILITY",
  "CHUẨN HÓA LAYOUT": "STANDARDIZING LAYOUT OF",
  "HẠ TẦNG KỸ THUẬT": "TECHNICAL INFRASTRUCTURE",
  "CHO NỀN TẢNG SỐ HÓA": "FOR DIGITAL PLATFORMS",
  "Thiết lập mô hình điều hành Agile PMO cho hệ thống quản trị linh hoạt và hiệu quả": "Establishing Agile PMO operational models for flexible, highly effective project governance",
  "Áp dụng giải pháp CDE hạt nhân hóa đa tích hợp, rà soát xung đột thiết kế kỹ thuật ngầm và kiểm soát rủi ro tiến độ, chất lượng trong toàn bộ vòng đời dự án đầu tư.": "Deploying nucleated multi-integrated CDE solutions, resolving subsurface technical design clashes, and controlling schedule/quality risks across project lifecycle.",
  "Giải Pháp PMO": "PMO Solutions",
  "Nhận Tư Vấn Trực Tiếp": "Get Direct Consultation",
  "CHIẾN LƯỢC & QUY HOẠCH ĐÔ THỊ THÔNG MINH": "SMART URBAN STRATEGY & SPATIAL PLANNING",
  "KIẾN TẠO CÔNG TRÌNH": "CREATING ICONIC &",
  "BIỂU TƯỢNG VÀ BỀN VỮNG": "SUSTAINABLE DEVELOPMENTS",
  "CHO TƯƠNG LAI": "FOR THE FUTURE",
  "Hợp tác cùng DIDI Center Kiến Lạc và các định chế nghiên cứu hàng đầu": "Collaborating with DIDI Center Kien Lac and leading research institutions",
  "Tích hợp công nghệ GIS không gian số, Digital Twin công trình và quản trị dữ liệu lớn nhằm tối ưu hóa chi phí đầu tư và vận hành đô thị thông minh.": "Integrating digital spatial GIS, building Digital Twins, and big data governance to optimize lifecycle capital expenditure and smart city operations.",
  "Xem Hồ Sơ Năng Lực": "View Capability Dossier",
  "Hội Đồng Chuyên Gia": "Advisory Expert Council",
  "Khung năng lực tích hợp số": "Digital Capability Framework",
  "Hạt nhân hóa dữ liệu dự án": "Nucleated Project Data",
  "Chuẩn hóa layout hạ tầng": "Infrastructure Layout Standards",
  "Quản trị dự án linh hoạt": "Agile Project Governance",
  "Năm Kiến Tạo Năng Lực Chiến Lược & Tích Hợp Số": "Years Building Strategic Capability & Digital Integration",
  "Chào Mừng Quý Khách Đến Với": "Welcome to",
  "Lạc Hồng Digital": "Lac Hong Digital",
  "(thuộc Viện Nghiên Cứu Chiến Lược Và Phát Triển Lạc Hồng) là tổ chức khoa học công nghệ và tư vấn chuyên sâu hàng đầu trong lĩnh vực nghiên cứu chiến lược, quy hoạch phát triển đô thị, chuẩn hoá khung năng lực thực thi PMO và mô hình BIM - CDE cho các tập đoàn xây lắp, đầu tư hạ tầng tại Việt Nam.": "(under the Lac Hong Institute of Strategic Research & Development) is a leading science, technology, and strategic advisory organization specializing in urban planning, PMO execution capability standardisation, and BIM - CDE implementation for construction and infrastructure corporations across Vietnam.",
  "Với thông điệp": "Guided by our motto",
  "“Tận tâm vì giá trị bền vững”": "“Devoted to Sustainable Values”",
  ", Lạc Hồng Digital cam kết mang đến những giải pháp tích hợp số hoá chuẩn mực, giúp các chủ đầu tư và nhà thầu tối ưu hóa chi phí, rút ngắn thời gian triển khai và nâng tầm năng lực quản trị dự án theo chuẩn quốc tế.": ", Lac Hong Digital is committed to delivering standardized digital integration solutions, empowering project owners and contractors to optimize investment costs, accelerate schedules, and elevate governance capabilities to global benchmarks.",
  "UY TÍN": "PRESTIGE",
  "Cam kết chất lượng chuẩn mực, đồng hành bền vững cùng các cơ quan, viện trường và doanh nghiệp lớn.": "Committed to uncompromising standards, providing enduring partnership to government agencies, academic institutions, and leading enterprises.",
  "CHẤT LƯỢNG": "QUALITY",
  "Ứng dụng công nghệ tiên tiến nhất (BIM-CDE, GIS, Agile) với dữ liệu chuẩn xác và quy trình nghiệm thu nghiêm ngặt.": "Deploying cutting-edge technologies (BIM-CDE, GIS, Agile) with high-fidelity data and rigorous quality assurance protocols.",
  "HIỆU QUẢ": "EFFICIENCY",
  "Tối ưu hóa nguồn lực đầu tư, rút ngắn chu kỳ thực thi và giảm thiểu triệt để xung đột kỹ thuật trên công trường.": "Optimizing capital resources, shortening delivery cycles, and eliminating on-site technical clashes before construction.",
  "Xem Chi Tiết Về Lạc Hồng": "Learn More About Lac Hong",
  "Năng Lực Cốt Lõi": "Core Capabilities",
  "Lĩnh Vực Hoạt Động Chủ Lực": "Key Operational Sectors",
  "Lạc Hồng Digital cung cấp hệ sinh thái giải pháp đồng bộ từ hoạch định chiến lược, quản trị PMO linh hoạt đến tư vấn thiết kế BIM và số hóa hạ tầng kỹ thuật đô thị.": "Lac Hong Digital provides an integrated ecosystem from strategic master planning and Agile PMO governance to BIM design consulting and urban technical infrastructure digitization.",
  "Nghiên Cứu Chiến Lược & Thể Chế Số": "Strategic & Digital Institutional Research",
  "Xây dựng các đề án quy hoạch tổng thể, chiến lược chuyển đổi số ngành xây dựng, thể chế đầu tư công - tư và giải pháp phát triển bền vững ESG.": "Formulating master development plans, construction digital transformation roadmaps, public-private partnership (PPP) frameworks, and ESG sustainability strategies.",
  "Đề án quy hoạch chiến lược vùng & đô thị": "Regional & urban strategic spatial planning",
  "Tư vấn khung thể chế và chính sách đầu tư": "Institutional frameworks & investment policy advisory",
  "Nghiên cứu chỉ số phát triển bền vững ESG": "ESG sustainability index & green building research",
  "Tìm hiểu thêm": "Learn more",
  "Quản Trị Dự Án PMO & Tích Hợp Số": "PMO Project Governance & Digital Integration",
  "Thiết lập văn phòng PMO chuẩn hóa, triển khai mô hình Agile PMO giúp chủ đầu tư giám sát toàn diện tiến độ, chi phí, vật tư và chất lượng thi công.": "Establishing standardized PMO offices and agile PMO frameworks to empower owners with real-time oversight of schedule, budget, procurement, and construction quality.",
  "Chuẩn hóa khung năng lực PMO tích hợp số": "Standardizing digital integrated PMO capability framework",
  "Triển khai Agile PMO cho ban quản lý dự án": "Deploying Agile PMO for project management units",
  "Dashboard điều hành trực quan hóa thời gian thực": "Real-time visualized executive dashboards",
  "Tư Vấn Thiết Kế & Mô Hình BIM - CDE": "Design Advisory & BIM - CDE Solutions",
  "Ứng dụng giải pháp Mô hình thông tin công trình (BIM) từ giai đoạn ý tưởng đến thi công và bàn giao vận hành trên nền tảng môi trường dữ liệu chung (CDE).": "Applying Building Information Modeling (BIM) from conceptual design through construction and lifecycle handover via Common Data Environment (CDE) platforms.",
  "Rà soát xung đột thiết kế kỹ thuật (Clash Detection)": "Automated technical clash detection & resolution",
  "Số hóa hồ sơ hoàn công và Digital Twin": "As-built documentation digitization & Digital Twins",
  "Thiết lập môi trường dữ liệu chung chuẩn ISO 19650": "Setting up ISO 19650 compliant Common Data Environments",
  "Quy Hoạch & Hạ Tầng Kỹ Thuật Đô Thị": "Urban Planning & Technical Infrastructure",
  "Chuẩn hóa Layout hạ tầng kỹ thuật ngầm và nổi, tích hợp bản đồ số GIS không gian đô thị phục vụ công tác cấp phép, giám sát và quản lý đô thị thông minh.": "Standardizing subsurface and surface infrastructure layouts, integrating spatial GIS base maps for permitting, oversight, and smart urban operations.",
  "Chuẩn hóa Layout hệ thống kỹ thuật ngầm": "Underground technical infrastructure layout standardization",
  "Bản đồ số GIS tích hợp quy hoạch sử dụng đất": "Digital GIS mapping integrated with land-use master plans",
  "Giải pháp hạ tầng kỹ thuật chống ngập & năng lượng": "Flood-mitigation & smart energy infrastructure solutions",
  "Đầu Tư & Hợp Tác Giải Pháp Công Nghệ": "Technology Investment & Strategic Solutions",
  "Đồng hành tài chính và công nghệ cùng các đối tác trong phát triển các nền tảng phần mềm chuyên ngành xây dựng, AI phân tích dữ liệu và thiết bị IoT giám sát công trường.": "Partnering financially and technically to co-develop construction software platforms, AI predictive analytics, and IoT jobsite surveillance equipment.",
  "Nền tảng điều hành thông minh CDE Portal": "Intelligent CDE Portal operations platform",
  "Thiết bị IoT giám sát trắc địa, an toàn lao động": "IoT sensors for surveying & jobsite safety monitoring",
  "Hợp tác đầu tư chuyển đổi số theo mô hình PPP": "Public-Private Partnership (PPP) digital investment models",
  "Đào Tạo & Chuyển Giao Năng Lực": "Training & Capability Transfer",
  "Tổ chức các khóa bồi dưỡng chuyên sâu khung năng lực Giám đốc dự án PMO, Quản lý BIM (BIM Manager), kiểm soát chất lượng và chuyển giao công nghệ cho doanh nghiệp.": "Conducting executive training for PMO Project Directors, BIM Managers, quality assurance leaders, and transferring turnkey digital workflows to enterprises.",
  "Chứng chỉ năng lực PMO 4.0 thực chiến": "Professional PMO 4.0 execution certification",
  "Đào tạo chuyên sâu kỹ sư BIM - Revit - Navisworks": "Specialized engineering training in BIM - Revit - Navisworks",
  "Chuyển giao quy trình vận hành số hóa nội bộ": "Turnkey internal digital operating process transfer",
  "Dấu Ấn Thực Chiến": "Practical Footprint",
  "Dự Án & Đề Tài Tiêu Biểu": "Featured Projects & Key Initiatives",
  "Các công trình hạ tầng trọng điểm, đề tài nghiên cứu chiến lược và dự án chuẩn hóa PMO đã được Lạc Hồng Digital triển khai thành công.": "Major infrastructure developments, strategic research initiatives, and PMO standardization projects successfully delivered by Lac Hong Digital.",
  "Tất Cả Dự Án": "All Projects",
  "Quản Trị PMO & BIM": "PMO Governance & BIM",
  "Hạ Tầng Kỹ Thuật": "Technical Infrastructure",
  "Đề Tài Chiến Lược": "Strategic Initiatives",
  "Đô Thị Số": "Digital Cities",
  "TP.HCM & Đông Nam Bộ": "HCMC & Southeast Region",
  "Chiến Lược Tư Vấn Phát Triển Hạ Tầng Giao Thông - Metro & TOD": "Strategic Advisory for Transport Infrastructure – Metro & TOD",
  "Chuẩn hóa layout hạ tầng ngầm, xây dựng nền tảng bản đồ số GIS và môi trường dữ liệu dùng chung CDE cho các trục đường kết nối logistic liên vùng.": "Standardizing underground infrastructure layout, building digital GIS map platforms, and CDE environments for inter-regional logistics corridors.",
  "Triển khai giai đoạn 2": "Phase 2 in progress",
  "Chi tiết": "Details",
  "Toàn Quốc": "National Scope",
  "Hoàn thành 2025": "Completed 2025",
  "Chuẩn hóa Khung Năng Lực thực thi PMO Tích Hợp Số": "Standardizing Digital Integrated PMO Execution Capability Framework",
  "Nghiên cứu, thiết kế, chuẩn hóa , tái cấu quy trình Quản trị dự án trong ngành xây dựng - đầu tư - quy hoạch phát triển đô thị. Trên hệ tư duy linh hoạt Agile.": "Researching, designing, standardizing, and restructuring Project Management workflows in construction, real estate investment, and urban development using Agile methodologies.",
  "Đạt chứng chỉ quản trị": "Governance Certified",
  "TP. Thủ Đức, TP.HCM": "Thu Duc City, HCMC",
  "Mô Hình Vận Hành BIM -GIS Quần Thể Đô Thị Đổi Mới Sáng Tạo": "BIM - GIS Operations Model for Innovation Urban Complex",
  "Tư vấn thiết kế mô hình thông tin công trình BIM cấp độ 300 - 500, tích hợp công nghệ bản sao kỹ thuật số Digital Twin cho tòa nhà trung tâm điều hành.": "Consulting on BIM LOD 300 - 500 models, integrating Digital Twin technology for the central operations command facility.",
  "Đang thi công hoàn thiện": "Finishing construction",
  "Vùng Đông Nam Bộ": "Southeast Region",
  "Chiến Lược Phát Triển Hạ Tầng Giao Thông (Bãi đổ xe thông minh)": "Transport Infrastructure Development Strategy (Smart Parking)",
  "Báo cáo khoa học độc lập đánh giá mạng lưới giao thông liên vùng, đề xuất các cơ chế thu hút vốn đầu tư tư nhân và quy hoạch layout trạm trung chuyển.": "Independent scientific report assessing regional transport networks, proposing private capital mobilization mechanisms, and planning interchange hub layouts.",
  "Đã xuất bản tài liệu": "Published dossier",
  "Trung Tâm IOC": "IOC Command Center",
  "Bình Dương / TP.HCM": "Binh Duong / HCMC",
  "Hệ Thống Trung Tâm Điều Hành Đô Thị Thông Minh (IOC) & CSDL Không Gian": "Smart City Intelligent Operations Center (IOC) & Spatial Database",
  "Thiết kế giải pháp kết nối cảm biến IoT giao thông, quản lý rác thải đô thị, chiếu sáng công cộng và cảnh báo ngập úng tự động theo thời gian thực.": "Designing solutions to connect traffic IoT sensors, municipal waste management, public lighting, and automated real-time flood early warning systems.",
  "Vũng Tàu - Phan Thiết": "Vung Tau - Phan Thiet",
  "Tư vấn triển khai Làng Hưu Trí Sinh Thái (Silver Economy)": "Advisory on Eco-Retirement Village Development (Silver Economy)",
  "Xây dựng quy chế phối hợp đa bên giữa Chủ đầu tư - Ban QLDA - Tư vấn thiết kế - Tổng thầu thi công.": "Formulating multi-stakeholder coordination protocols among Project Owner - PMU - Design Consultant - General Contractor.",
  "Năm Nghiên Cứu & Phát Triển": "Years of R&D Excellence",
  "Công Trình & Đề Tài Thực Hiện": "Projects & Initiatives Delivered",
  "Chuẩn Hóa Dữ Liệu & Hài Lòng": "Data Standardization & Satisfaction",
  "Chuyên Gia & Kỹ Sư Số Đào Tạo": "Experts & Digital Engineers Trained",
  "Hệ Sinh Thái Lạc Hồng": "Lac Hong Ecosystem",
  "Trung Tâm Trực Thuộc & Đơn Vị Liên Kết": "Affiliated Centers & Member Units",
  "Mạng lưới các trung tâm nghiên cứu chuyên sâu, viện đào tạo và phòng thí nghiệm công nghệ tạo nên sức mạnh tổng lực của Viện Lạc Hồng.": "A network of specialized research centers, executive institutes, and technology labs powering the synergistic excellence of Lac Hong Institute.",
  "Trung Tâm Hạt Nhân": "Nucleus Innovation Center",
  "Trung tâm Nghiên cứu, Thiết kế Tích hợp Số và Đổi Mới Sáng Tạo Kiến Lạc. Đơn vị hạt nhân nghiên cứu chuẩn hóa Layout hạ tầng kỹ thuật và khung năng lực PMO.": "Kien Lac Center for Digital Integration Design and Innovation. The core unit pioneering technical infrastructure layout standardization and PMO frameworks.",
  "Chuẩn hóa Layout hạ tầng kỹ thuật": "Infrastructure layout standardization",
  "Mô hình Agile PMO thực chiến": "Practical Agile PMO framework",
  "Cổng thông tin: kienlac.vn": "Portal: kienlac.vn",
  "Truy cập web.kienlac.vn": "Visit web.kienlac.vn",
  "Công Nghệ Số": "Digital Technology",
  "Trung Tâm Tích Hợp BIM & IOC": "BIM & IOC Integration Center",
  "Chuyên trách nghiên cứu và ứng dụng công nghệ BIM cấp độ cao, thiết lập môi trường CDE bảo mật và phân tích mô phỏng kết cấu trên nền tảng điện toán đám mây.": "Specializing in advanced BIM modeling, secure Common Data Environments (CDE), and cloud-based structural simulation analytics.",
  "Rà soát xung đột thiết kế tự động": "Automated design clash resolution",
  "Xây dựng thư viện cấu kiện số chuẩn Việt Nam": "Standardized digital BIM component libraries",
  "Nền tảng điều hành dự án thông minh": "Intelligent project management platform",
  "Xem hồ sơ năng lực": "View capability profile",
  "Đào Tạo & Chuyển Giao": "Training & Knowledge Transfer",
  "Học Viện Quản Trị PMO Lạc Hồng": "Lac Hong PMO Executive Academy",
  "Trung tâm đào tạo cán bộ chỉ huy trưởng, kỹ sư trắc địa, giám sát trưởng và giám đốc ban QLDA đạt chứng chỉ khung năng lực thực thi PMO 4.0 chuẩn quốc tế.": "Executive academy training chief engineers, surveyors, chief supervisors, and PMU directors certified in international-standard PMO 4.0 capabilities.",
  "Khóa học PMO Master & Agile Construction": "PMO Master & Agile Construction courses",
  "Đào tạo thực hành trên dự án thật": "Hands-on training on live megaprojects",
  "Cấp chứng nhận có giá trị chuyên môn cao": "Nationally recognized professional certification",
  "Chương trình đào tạo": "Curriculum details",
  "Bản Tin & Chuyên San": "Bulletins & Journals",
  "Tin Tức - Sự Kiện & Nghiên Cứu": "News, Events & Research Insights",
  "Cập nhật những góc nhìn chuyên gia, nghiên cứu khoa học và hoạt động nổi bật từ Viện Nghiên Cứu Lạc Hồng và Lạc Hồng Digital.": "Up-to-date expert perspectives, scientific research papers, and prominent activities from Lac Hong Institute and Lac Hong Digital.",
  "Sự Kiện Khoa Học": "Scientific Events",
  "18 Tháng 9, 2026": "September 18, 2026",
  "Hội Thảo Quốc Gia: Ứng Dụng Agile PMO & Mô Hình BIM-CDE Trong Kỷ Nguyên Số": "National Conference: Applying Agile PMO & BIM-CDE Models in the Digital Era",
  "Viện Nghiên Cứu Chiến Lược Và Phát Triển Lạc Hồng phối hợp cùng các viện trường kỹ thuật tổ chức diễn đàn chuyên đề giải bài toán xung đột hạ tầng và quản lý tiến độ thi công.": "Lac Hong Institute of Strategic Research & Development in partnership with technical universities organized a symposium addressing infrastructure clashes and schedule management.",
  "Đọc tiếp": "Read more",
  "Bản Tin Kiến Lạc": "Kien Lac Bulletin",
  "12 Tháng 9, 2026": "September 12, 2026",
  "Người Giữ Nhịp Cho Những Đô Thị Tương Lai: Chuẩn Hóa Layout Hạ Tầng Kỹ Thuật": "Pacing the Cities of Tomorrow: Standardizing Technical Infrastructure Layouts",
  "Phân tích chuyên sâu từ Kien Lac DIDI Center về tầm quan trọng của việc chuẩn hóa cấu trúc hạ tầng ngầm ngay từ khâu phê duyệt quy hoạch tổng mặt bằng 1/500.": "In-depth analysis from Kien Lac DIDI Center highlighting the critical role of subsurface utility layout standardization right from 1/500 master plan approval.",
  "Trách Nhiệm Xã Hội (CSR)": "Corporate Social Responsibility (CSR)",
  "05 Tháng 9, 2026": "September 05, 2026",
  "Lạc Hồng Digital Trao Học Bổng & Chuyển Giao Bản Quyền Phần Mềm Quản Trị Cho Đại Học": "Lac Hong Digital Awards Scholarships & Donates Management Software Licenses to Universities",
  "Đồng hành ươm mầm thế hệ kỹ sư công nghệ xây dựng mới, Lạc Hồng Digital trao tặng 50 suất học bổng PMO và bản quyền phần mềm quản lý dự án cho sinh viên xuất sắc.": "Nurturing the next generation of construction tech engineers, Lac Hong Digital presented 50 PMO scholarships and enterprise software licenses to top students.",
  "TRIẾT LÝ KIẾN TẠO & TINH THẦN NỘI TẠI": "CREATIVE PHILOSOPHY & INNER SPIRIT",
  "“Mỗi ngày được sống trong đất nước hòa bình, đó là món quà vô giá mà Tổ Quốc đã dành cho ta. Biết ơn những con người ngày đêm âm thầm giữ gìn bờ cõi, để dân tộc ta được sống trong an bình. Nguyện một lòng vì đất nước vì non sông, cùng nhau góp sức, đồng lòng, nhất quán tư tưởng bồi tụ, xây đắp, kiến tạo nên một ngày mai tươi đẹp, phát triển thịnh vượng và bền vững.”": "“Living in peace each day is an invaluable gift bestowed by our Homeland. We express profound gratitude to those who quietly safeguard our borders day and night so our people may dwell in serenity. Devoted wholeheartedly to the country and the nation, we unite our strengths and align our collective mindset to cultivate, build, and pioneer a prosperous and sustainable tomorrow.”",
  "MỘT NGÔI NHÀ THÀNH CÔNG": "A SUCCESSFUL HOME",
  "Có Nội Khí": "Inner Vitality",
  "MỘT NGƯỜI THÀNH CÔNG": "A SUCCESSFUL PERSON",
  "Có Nội Lực": "Inner Strength",
  "MỘT TỔ CHỨC THÀNH CÔNG": "A SUCCESSFUL ORGANIZATION",
  "Nội Bộ Bền Vững !": "Enduring Internal Cohesion !",
  "Hợp Tác Toàn Diện": "Comprehensive Partnerships",
  "Đối Tác & Viện Trường Đồng Hành": "Partners & Academic Collaborators",
  "Hội Quy hoạch phát triển đô thị Việt Nam": "Vietnam Urban Planning and Development Association",
  "Viện Quy hoạch và Kiến trúc đô thị": "Urban Architecture & Planning Institute",
  "Viện Quy hoạch phát triển đô thị Bền vững": "Institute of Sustainable Urban Planning and Development",
  "ĐỒNG HÀNH CHIẾN LƯỢC": "STRATEGIC PARTNERSHIP",
  "Sẵn Sàng Chuẩn Hóa Dự Án Của Bạn Cùng Lạc Hồng Digital?": "Ready to Standardize Your Project with Lac Hong Digital?",
  "Đội ngũ nhà khoa học, chuyên gia trưởng PMO và kỹ sư công nghệ của Viện Nghiên Cứu Lạc Hồng sẵn sàng khảo sát, đánh giá và xây dựng lộ trình tích hợp số hóa riêng biệt cho dự án của Quý đối tác.": "Our senior scientists, chief PMO specialists, and software engineers are prepared to assess and engineer a tailor-made digital transformation roadmap for your project.",
  "Ms. Hồng": "Ms. Hong",
  "Trụ sở: 566 QL 13, TP.HCM & Chi nhánh: Phú Quốc, Tân Đông Hiệp, Thủ Đức": "HQ: 566 National Route 13, HCMC & Branches: Phu Quoc, Tan Dong Hiep, Thu Duc",
  "Nhận Hồ Sơ Năng Lực & Tư Vấn": "Request Capability Dossier & Advisory",
  "Gửi Yêu Cầu Hỗ Trợ": "Submit Support Request",
  "LẠC HỒNG DIGITAL (Lạc Hồng Digtial)": "LAC HONG DIGITAL",
  "Trụ sở chính:": "Headquarters:",
  "566 Quốc Lộ 13, khu phố 19, phường Hiệp Bình, TP. Hồ Chí Minh": "566 National Route 13, Quarter 19, Hiep Binh Ward, Ho Chi Minh City",
  "Văn phòng & Chi nhánh:": "Offices & Branches:",
  "Phú Quốc:": "Phu Quoc:",
  "Số 16 Nguyễn Chí Thanh, KP 12 Dương Đông, Đặc khu Phú Quốc, Tỉnh An Giang": "No. 16 Nguyen Chi Thanh, Quarter 12 Duong Dong, Phu Quoc Special Zone, An Giang Province",
  "Tân Đông Hiệp:": "Tan Dong Hiep:",
  "Số 5 đường D7, KDC Phát triển đô thị Tân Bình, KP Tân Phước, P. Tân Đông Hiệp, TP.HCM": "No. 5 D7 Street, Tan Binh Urban Residential Area, Tan Phuoc Ward, Tan Dong Hiep, HCMC",
  "Thủ Đức:": "Thu Duc:",
  "Số 190 Võ Văn Ngân, Phường Thủ Đức, TP. Hồ Chí Minh, Tỉnh An Giang": "No. 190 Vo Van Ngan, Thu Duc Ward, Ho Chi Minh City",
  "0909.860.118 (Mr. William) | 0967.326.847 (Ms. Hồng)": "0909.860.118 (Mr. William) | 0967.326.847 (Ms. Hong)",
  "Lĩnh Vực Hoạt Động": "Key Operational Sectors",
  "Nghiên cứu chiến lược & ESG": "Strategic Research & ESG",
  "Quản trị dự án Agile PMO": "Agile PMO Project Governance",
  "Tư vấn thiết kế & BIM - CDE": "Design Consulting & BIM - CDE",
  "Chuẩn hóa Layout hạ tầng ngầm": "Underground Infrastructure Layout Standardization",
  "Đầu tư & Hợp tác giải pháp số": "Digital Investment & Solutions",
  "Đào tạo năng lực PMO 4.0": "PMO 4.0 Capability Training",
  "Liên Kết Nhanh": "Quick Links",
  "Về chúng tôi (Giới thiệu Viện)": "About Us (Institute Overview)",
  "Danh mục dự án tiêu biểu": "Featured Projects Portfolio",
  "Bản tin & Chuyên san nghiên cứu": "Bulletins & Research Journals",
  "Thông tin liên hệ & Bản đồ": "Contact Info & Map",
  "Cộng đồng WhatsApp": "WhatsApp Community",
  "Đăng Ký Nhận Bản Tin": "Subscribe to Newsletter",
  "Nhận thông báo về các nghiên cứu mới nhất, báo cáo quy hoạch và lịch khai giảng khóa đào tạo chuyên gia PMO.": "Receive updates on latest research papers, urban planning reports, and upcoming PMO executive course schedules.",
  "Gửi": "Send",
  "(Lạc Hồng Digital). Bản quyền được bảo hộ toàn diện.": "(Lac Hong Digital). All rights reserved.",
  "Tên miền:": "Domain:",
  "• Địa chỉ: 566 Quốc Lộ 13, khu phố 19, phường Hiệp Bình, TP.HCM": "• Address: 566 National Route 13, Quarter 19, Hiep Binh Ward, HCMC",
  "Tìm kiếm trên Lạc Hồng Digital": "Search on Lac Hong Digital",
  "Nhập từ khóa tìm kiếm về đề tài nghiên cứu, dự án PMO, quy hoạch hạ tầng hoặc bài viết chuyên môn:": "Enter keywords for research papers, PMO projects, infrastructure planning, or publications:",
  "Tìm kiếm": "Search",
  "Hồ Sơ Dự Án Thực Chiến": "Case Study Project Dossier",
  "Tên Dự Án": "Project Name",
  "Đối tác / Chủ đầu tư:": "Partner / Project Owner:",
  "Quy mô triển khai:": "Project Scope:",
  "Liên Hệ Hợp Tác Tương Tự": "Contact for Similar Project",
  "TChuẩn hóa Khung Năng Lực thực thi PMO Tích Hợp Số": "Standardizing Digital Integrated PMO Execution Capability Framework",
  "Chiến Lược Phát Triển Hạ Tầng Giao Thông (Bãi đỗ xe thông minh)": "Transport Infrastructure Strategy (Smart Parking)",
  "Hội Quy hoạch phát triển đô thị Việt Nam (VUPDA)": "Vietnam Urban Planning and Development Association (VUPDA)",
  "Viện Quy hoạch và Kiến trúc đô thị (UAI)": "Urban Architecture & Planning Institute (UAI)",
  "Viện Quy hoạch phát triển đô thị Bền vững (IUPSD)": "Institute of Sustainable Urban Planning and Development (IUPSD)",
  "Họ và tên Quý đối tác *": "Full Name of Partner / Client *",
  "Số điện thoại liên hệ *": "Contact Phone Number *",
  "Tên đơn vị / Tên dự án": "Organization / Project Name",
  "Nhập email của bạn...": "Enter your email...",
  "Ví dụ: Agile PMO, Layout hạ tầng ngầm, BIM-CDE, quy hoạch...": "E.g., Agile PMO, underground utilities, BIM-CDE, planning...",
  "Giới Thiệu | Viện Nghiên Cứu Chiến Lược Và Phát Triển Lạc Hồng - Lạc Hồng Digital": "About Us | Lac Hong Institute of Strategic Research & Development - Lac Hong Digital",
  "Giới thiệu về Viện Lạc Hồng Digital": "About Lac Hong Digital Institute",
  "Hồ Sơ Năng Lực Tổ Chức": "Organizational Capability Dossier",
  "TỔNG QUAN VIỆN NGHIÊN CỨU CHIẾN LƯỢC VÀ PHÁT TRIỂN LẠC HỒNG (LẠC HỒNG DIGITAL)": "OVERVIEW OF LAC HONG INSTITUTE OF STRATEGIC RESEARCH & DEVELOPMENT (LAC HONG DIGITAL)",
  "Viện Nghiên Cứu Chiến Lược Và Phát Triển Lạc Hồng": "Lac Hong Institute of Strategic Research & Development",
  "(tên giao dịch quốc tế: ": "(international name: ",
  "(tên giao dịch quốc tế:": "(international name:",
  ") cùng thương hiệu công nghệ": ") alongside its technology brand",
  "(Lạc Hồng Digtial) là tổ chức nghiên cứu khoa học, tư vấn thể chế và phát triển giải pháp tích hợp số hóa chuyên sâu cho lĩnh vực quy hoạch đô thị, hạ tầng giao thông và quản trị dự án xây dựng (PMO).": "(Lac Hong Digital) is a scientific research, institutional advisory, and digital integration solution developer specializing in urban planning, transport infrastructure, and construction project management (PMO).",
  "Trụ sở chính của Viện đặt tại": "The Institute's headquarters is situated at",
  "cùng hệ thống văn phòng, chi nhánh đại diện tại": "alongside regional branch offices in",
  "Đặc khu Phú Quốc, Tân Đông Hiệp và Thủ Đức": "Phu Quoc Special Zone, Tan Dong Hiep, and Thu Duc",
  ". Trải qua hơn 15 năm hình thành và phát triển, Viện đã quy tụ mạng lưới hơn 120 giáo sư, tiến sĩ, chuyên gia đầu ngành trong và ngoài nước, thực hiện thành công hàng trăm đề tài cấp bộ, cấp tỉnh và các dự án tư vấn quy mô lớn cho các tổng công ty, tập đoàn bất động sản và các định chế tài chính quốc tế.": ". Over more than 15 years of foundation and growth, the Institute has brought together a network of over 120 professors, doctors, and top domestic and international experts, successfully completing hundreds of ministerial and provincial-level initiatives and major advisory engagements for corporations and international financial institutions.",
  "Tầm Nhìn Chiến Lược": "Strategic Vision",
  "Trở thành Viện nghiên cứu chiến lược và trung tâm tư vấn tích hợp số hàng đầu Đông Nam Á, đóng vai trò hạt nhân kiến tạo các chuẩn mực quy hoạch hạ tầng kỹ thuật và quản trị dự án thông minh (Agile PMO) đạt chuẩn quốc tế.": "To become the leading strategic research institute and digital integration consultancy in Southeast Asia, pioneering international benchmarks for technical infrastructure planning and smart project management (Agile PMO).",
  "Sứ Mệnh Phụng Sự": "Dedicated Mission",
  "Nghiên cứu ứng dụng tri thức khoa học và công nghệ số để giải quyết các nút thắt trong quản lý đầu tư xây dựng, số hóa hạ tầng đô thị và bảo vệ môi trường, mang lại giá trị gia tăng vượt trội và bền vững cho cộng đồng xã hội.": "To research and apply scientific knowledge and digital technology to solve key bottlenecks in construction capital management, urban infrastructure digitization, and environmental preservation, delivering superior and enduring value to society.",
  "Triết Lý Hành Động": "Action Philosophy",
  ". Mỗi giải pháp, mỗi đề tài nghiên cứu đều lấy tính ứng dụng thực chiến làm thước đo, chuẩn mực khoa học làm nền tảng và lợi ích lâu dài của đối tác làm đích đến.": ". Every solution and research study measures its success by practical applicability, founded on scientific rigor and focused on the lasting prosperity of our partners.",
  "Cơ Cấu Quản Trị": "Governance Structure",
  "Sơ Đồ Tổ Chức & Bộ Máy Điều Hành": "Organization Chart & Executive Governance",
  "Mô hình quản trị hiện đại, tinh gọn và tích hợp số hóa cao giữa Hội đồng Khoa học và Ban Điều Hành thực thi.": "A modern, lean, highly digitized governance model connecting the Scientific Council with executive management.",
  "HỘI ĐỒNG VIỆN & HỘI ĐỒNG KHOA HỌC": "INSTITUTE COUNCIL & SCIENTIFIC ADVISORY BOARD",
  "VIỆN TRƯỞNG & BAN ĐIỀU HÀNH DOANH NGHIỆP": "DIRECTOR GENERAL & EXECUTIVE BOARD",
  "Khối Nghiên Cứu Chiến Lược": "Strategic Research Division",
  "Quy hoạch, thể chế, ESG": "Planning, Institutions & ESG",
  "Layout hạ tầng & Agile PMO": "Infrastructure Layout & Agile PMO",
  "Khối Tích Hợp BIM & IOC": "BIM & IOC Integration Division",
  "Học Viện Đào Tạo Lạc Hồng": "Lac Hong Executive Training Academy",
  "Chuẩn hóa năng lực PMO 4.0": "PMO 4.0 Capability Standards",
  "Khung Vận Hành Hạt Nhân Tích Hợp Số Lạc Hồng PMO - BIM CDE": "Lac Hong PMO - BIM CDE Digital Integrated Core Operational Framework",
  "Mãi mãi tinh thần Khởi nghiệp": "Everlasting Entrepreneurial Spirit",
  "Lựa chọn đúng quan trọng hơn sự nỗ lực cố gắng": "Right Decisions Outweigh Sheer Effort",
  "Đồng hành, hiện diện, kề vai sát cánh và chung lưng đấu cật cùng dân tộc": "Standing Shoulder to Shoulder with the Nation",
  "Thích ứng nhanh là sức mạnh cạnh tranh": "Agility is Competitive Advantage",
  "Trưởng thành qua thách thức và thất bại": "Growth Through Challenges and Failures",
  "Đông Tây kết hợp": "Harmonizing Eastern Wisdom and Western Innovation",
  "Sáu giá trị cốt lõi đơm hoa kết trái trên cội nguồn tri thức và tinh thần nội tại của Lạc Hồng Digital": "Six core values blossoming from the roots of knowledge and the inner spirit of Lac Hong Digital",
  "Mạng Lưới Liên Kết": "Collaboration Network",
  "Lạc Hồng Digital đồng hành hợp tác chiến lược cùng các tổ chức nghiên cứu khoa học, viện trường và nền tảng công nghệ hàng đầu.": "Lac Hong Digital maintains strategic cooperation with leading scientific research organizations, universities, and technology platforms.",
  "Tư vấn thiết kế BIM - CDE": "BIM - CDE Design Consulting",
  "Giới thiệu Viện": "About the Institute",
  "Liên hệ hợp tác": "Contact & Partnership",
  "Bản Quyền & Tên Miền": "Copyright & Domain",
  "lachongdigital.vn - Cổng thông tin Viện Nghiên Cứu Chiến Lược Và Phát Triển Lạc Hồng.": "lachongdigital.vn - Information Portal of Lac Hong Institute of Strategic Research & Development.",
  "Lĩnh vực chuyên môn Lạc Hồng Digital": "Lac Hong Digital Specialized Disciplines",
  "01. Lĩnh vực chiến lược": "01. Strategic Research",
  "Viện Nghiên Cứu Chiến Lược Và Phát Triển Lạc Hồng giữ vai trò tư vấn độc lập cho các cơ quan quản lý nhà nước, tập đoàn tổng công ty xây dựng và nhà đầu tư trong việc xây dựng quy hoạch phát triển bền vững, chiến lược chuyển đổi số và áp dụng các tiêu chuẩn ESG (Môi trường - Xã hội - Quản trị).": "Lac Hong Institute of Strategic Research & Development acts as an independent advisor to government agencies, construction conglomerates, and real estate developers in crafting sustainable spatial plans, digital transformation roadmaps, and adopting ESG (Environmental, Social, Governance) criteria.",
  "Xây dựng đề án quy hoạch:": "Master Planning Development:",
  "Phân tích dữ liệu kinh tế - xã hội, cấu trúc không gian đô thị và hành lang kinh tế liên vùng.": "Analyzing socio-economic data, urban spatial layout, and inter-regional economic corridors.",
  "Khung thể chế đầu tư:": "Investment Institutional Framework:",
  "Tư vấn mô hình đầu tư đối tác công tư (PPP), cấu trúc tài chính và quản trị rủi ro pháp lý.": "Advising on public-private partnership (PPP) structures, financial engineering, and regulatory risk mitigation.",
  "Báo cáo chiến lược ESG:": "Strategic ESG Reports:",
  "Đánh giá tác động carbon, tối ưu hóa vật liệu xanh và đạt các chứng chỉ công trình xanh quốc tế (LEED, LOTUS).": "Carbon footprint lifecycle assessments, sustainable material optimization, and international green building certifications (LEED, LOTUS).",
  "02. Năng lực quản trị": "02. Governance Capabilities",
  "Quản Trị Dự Án PMO & Điều Hành Tích Hợp Số": "PMO Project Governance & Digital Operations",
  "Phát triển mô hình Agile PMO đột phá cho ngành xây lắp và bất động sản. Không còn phương pháp quản trị phân mảnh truyền thống, Lạc Hồng Digital thiết lập văn phòng điều hành số hóa tập trung, kết nối tức thì dữ liệu từ công trường đến ban tổng giám đốc.": "Pioneering an Agile PMO model for the construction and property sectors. Replacing fragmented traditional methods, Lac Hong Digital institutes a centralized digital command room connecting real-time jobsite data to executive management.",
  "Chuẩn hóa 24 bộ quy trình:": "Standardizing 24 Key Workflows:",
  "Quản lý tiến độ đường găng (CPM), khối lượng thanh quyết toán, kiểm soát vật tư thiết bị.": "Critical Path Method (CPM) scheduling, progress billing volumes, and materials/equipment supply chain controls.",
  "Dashboard điều hành Realtime:": "Real-time Executive Dashboards:",
  "Báo cáo tự động bằng biểu đồ chỉ số hiệu năng (KPI/EVM) giúp ra quyết định trong vài giây.": "Automated KPI and Earned Value Management (EVM) metric dashboards facilitating swift executive decisions.",
  "Kiểm soát rủi ro chi phí:": "Budget & Cost Risk Control:",
  "Cảnh báo sớm vượt ngân sách hoặc chậm trễ tiến độ thi công.": "Early warning alerts against budget overruns or critical path delays.",
  "03. Giải pháp công nghệ": "03. Technology Solutions",
  "Mô hình hóa thông tin công trình (BIM) chuẩn ISO 19650 là giải pháp xương sống của Lạc Hồng Digital. Chúng tôi giúp các dự án rà soát hàng ngàn điểm xung đột giữa kiến trúc, kết cấu và hệ thống cơ điện (MEP) trước khi đổ bê tông công trường.": "Building Information Modeling (BIM) compliant with ISO 19650 is Lac Hong Digital's flagship backbone. We resolve thousands of clashes among architecture, structural engineering, and MEP before pouring concrete on site.",
  "Tích hợp yếu tố thời gian thi công, chi phí dòng tiền và quản lý vòng đời vận hành.": "Integrating 4D construction sequencing, 5D cost forecasting, and 7D facility lifecycle management.",
  "Môi trường dữ liệu chung CDE:": "Common Data Environment (CDE):",
  "Bảo mật, phân quyền chuẩn hóa và lưu trữ trọn đời hồ sơ kỹ thuật số.": "Bank-grade security, role-based access governance, and permanent digital archive management.",
  "Bản sao kỹ thuật số hỗ trợ quản lý vận hành tòa nhà và công trình hạ tầng phức hợp.": "Digital Twins enabling smart facility management for complex buildings and infrastructure assets.",
  "Quý Đơn Vị Cần Tư Vấn Chuyên Sâu Về Khung Năng Lực PMO Hoặc Mô Hình BIM?": "Require Specialized Consultation on PMO Frameworks or BIM Solutions?",
  "Liên hệ ngay với Hội đồng Khoa học và Ban Điều Hành Lạc Hồng Digital để nhận hồ sơ năng lực và lịch khảo sát dự án.": "Connect with the Scientific Council and Executive Board of Lac Hong Digital to receive full capability dossiers and schedule site assessments.",
  "Liên Hệ Hotline: 0909.860.118 - Mr. William | 0967.326.847 - Ms. Hồng": "Hotline: 0909.860.118 - Mr. William | 0967.326.847 - Ms. Hong",
  "Các công trình & đề án thực tế": "Real-world projects & initiatives",
  "Hồ Sơ Năng Lực": "Capability Dossier",
  "Các Dự Án Trọng Điểm Đã Triển Khai": "Key Delivered Megaprojects",
  "Lạc Hồng Digital khẳng định uy tín qua các công trình quy mô, chuẩn mực kỹ thuật cao và hiệu quả tài chính bền vững cho chủ đầu tư.": "Lac Hong Digital affirms its prestige through large-scale developments, high technical standards, and sustainable financial performance for project owners.",
  "Nghiên cứu chiến lược": "Strategic research",
  "Tên Miền & Bản Quyền": "Domain & Copyright",
  "Nhập tên dự án, chuyên đề...": "Enter project name, topic...",
  "Bản tin, chuyên san & sự kiện": "Bulletins, journals & events",
  "Diễn đàn quy tụ hơn 250 đại biểu đại diện Bộ Xây dựng, các viện nghiên cứu, trường đại học kỹ thuật và ban lãnh đạo các tập đoàn tổng công ty xây lắp để thảo luận về lộ trình chuẩn hóa hạ tầng số.": "The forum brought together over 250 delegates representing the Ministry of Construction, research institutes, technical universities, and corporate executives to discuss digital infrastructure roadmaps.",
  "Bài viết phân tích tầm quan trọng của việc thống nhất mô hình tọa độ và phân lớp kỹ thuật ngầm từ sớm, tránh các rủi ro phát sinh kinh phí và ùn ứ thi công kéo dài.": "Article examining the essential role of early coordinate unification and underground technical layering in avoiding budget overruns and prolonged delays.",
  "Lạc Hồng Digital Trao Học Bổng & Chuyển Giao Bản Quyền Phần Mềm Cho Đại Học": "Lac Hong Digital Awards Scholarships & Software Licenses to Universities",
  "Chương trình tài trợ thường niên nhằm tạo cầu nối giữa giảng đường đại học và thực tiễn công trường số hóa cho sinh viên ngành xây dựng, quy hoạch và kiến trúc.": "An annual sponsorship program bridging university lecture halls and digitized jobsites for students of civil engineering, urban planning, and architecture.",
  "Nghiên Cứu Chuyên Sâu": "In-Depth Research",
  "28 Tháng 8, 2026": "August 28, 2026",
  "Phát Hành Báo Cáo Chiến Lược Xanh Hóa Hạ Tầng Đô Thị Vùng Đông Nam Bộ": "Release of Strategic Report on Greening Urban Infrastructure in Southeast Region",
  "Bộ chỉ số đo lường mức độ phát thải carbon trong thi công xây lắp và các khuyến nghị kỹ thuật vật liệu thay thế thân thiện với môi trường sinh thái.": "Carbon emission measurement index in construction and technical recommendations on eco-friendly alternative materials.",
  "Đào Tạo & Bồi Dưỡng": "Executive Training & Education",
  "15 Tháng 8, 2026": "August 15, 2026",
  "Khai Giảng Khóa Đào Tạo Giám Đốc Dự Án PMO Master Khóa 18": "Commencement of PMO Master Project Director Course Intake 18",
  "Chương trình đào tạo thực chiến 12 tuần giúp học viên làm chủ quy trình Agile PMO, ứng dụng Power BI và CDE trong giám sát dự án xây dựng quy mô lớn.": "A 12-week intensive masterclass equipping participants with Agile PMO execution, Power BI dashboards, and CDE project controls for megaprojects.",
  "Hợp Tác Quốc Tế": "International Cooperation",
  "02 Tháng 8, 2026": "August 02, 2026",
  "Lạc Hồng Digital Ký Thỏa Thuận Nghiên Cứu Chung Với Viện Hạ Tầng Singapore": "Lac Hong Digital Signs Joint Research Agreement with Singapore Infrastructure Institute",
  "Hai bên nhất trí cùng nghiên cứu giải pháp tối ưu hóa dữ liệu không gian ngầm (Underground GIS) và các mô hình tài chính xanh cho dự án giao thông công cộng.": "Both parties agreed to co-develop Underground GIS spatial solutions and green financing models for public transport developments.",
  "Kênh kết nối chính thức Lạc Hồng Digital": "Lac Hong Digital Official Communication Channels",
  "Thông Tin Trụ Sở": "Headquarters Information",
  "Tên công ty: Lạc Hồng Digital (Lạc Hồng Digtial)": "Company name: Lac Hong Digital",
  "Cổng thông tin & Nền tảng tích hợp số hoá:": "Portal & Digital Integration Platform:",
  "Hệ thống địa chỉ:": "Address System:",
  "• Trụ sở chính:": "• Headquarters:",
  "• Chi nhánh Phú Quốc:": "• Phu Quoc Branch:",
  "Số 16, đường Nguyễn Chí Thanh, Khu phố 12 Dương Đông, Đặc khu Phú Quốc, Tỉnh An Giang": "No. 16, Nguyen Chi Thanh Street, Quarter 12 Duong Dong, Phu Quoc Special Zone, An Giang Province",
  "• Chi nhánh Tân Đông Hiệp:": "• Tan Dong Hiep Branch:",
  "• Văn phòng Thủ Đức:": "• Thu Duc Office:",
  "Số 190 Võ Văn Ngân, Phường Thủ Đức, Thành phố Hồ Chí Minh, Tỉnh An Giang": "No. 190 Vo Van Ngan, Thu Duc Ward, Ho Chi Minh City",
  "Hotline tư vấn chuyên gia:": "Specialist Advisory Hotline:",
  "Thư điện tử (Email):": "Email Address:",
  "Cộng đồng kết nối WhatsApp:": "WhatsApp Community:",
  "Tham gia nhóm thảo luận chuyên môn": "Join our professional discussion group",
  "Gửi Yêu Cầu Tư Vấn / Hợp Tác": "Submit Consultation / Partnership Request",
  "Vui lòng điền thông tin bên dưới, chuyên gia Lạc Hồng Digital sẽ phản hồi trong vòng 24 giờ làm việc:": "Please fill out the form below. Lac Hong Digital experts will respond within 24 working hours:",
  "Họ và tên *": "Full Name *",
  "Số điện thoại *": "Phone Number *",
  "Email liên hệ": "Email Address",
  "Nội dung quan tâm": "Area of Interest",
  "Tư vấn khung năng lực PMO tích hợp số": "Digital integrated PMO capability advisory",
  "Mô hình BIM - CDE và rà soát xung đột thiết kế": "BIM - CDE modeling & design clash detection",
  "Số hóa Layout hạ tầng kỹ thuật đô thị": "Urban technical infrastructure layout digitization",
  "Nghiên cứu chiến lược quy hoạch & ESG": "Strategic planning & ESG research",
  "Đào tạo chuyên sâu cán bộ ban QLDA": "Executive training for PMU / project directors",
  "Hợp tác phát triển giải pháp công nghệ": "Technology solution development partnership",
  "Thông tin dự án / Lời nhắn": "Project Information / Message",
  "Gửi Yêu Cầu Trực Tuyến": "Submit Request Online",
  "Mạng Lưới Hoạt Động": "Operational Network",
  "Hệ Thống Trụ Sở & Các Văn Phòng Chi Nhánh": "Headquarters & Branch Network",
  "Lạc Hồng Digital hiện diện tại các trung tâm kinh tế và đô thị trọng điểm nhằm phục vụ, khảo sát và đồng hành cùng Quý đối tác thuận tiện nhất.": "Lac Hong Digital operates across major economic and urban hubs to best serve, inspect, and collaborate with our clients and partners.",
  "Trụ Sở Chính": "Headquarters",
  "TP. Hồ Chí Minh": "Ho Chi Minh City",
  "Địa chỉ:": "Address:",
  "Chỉ đường Google Map": "Get Directions on Google Maps",
  "Chi Nhánh": "Branch",
  "Phú Quốc": "Phu Quoc",
  "Văn phòng đại diện": "Representative Office",
  "Tân Đông Hiệp": "Tan Dong Hiep",
  "Số 5 đường D7, KDC Phát triển đô thị Tân Bình, KP Tân Phước, phường Tân Đông Hiệp, TP. Hồ Chí Minh": "No. 5 D7 Street, Tan Binh Urban Residential Area, Tan Phuoc Ward, Tan Dong Hiep Ward, HCMC",
  "Văn phòng chi nhánh": "Branch Office",
  "Văn Phòng": "Office",
  "Thủ Đức": "Thu Duc",
  "Văn phòng làm việc": "Working Office",
  "Nguyễn Văn A": "Nguyen Van A",
  "Mô tả sơ bộ về dự án, địa điểm và nhu cầu hỗ trợ của Quý vị...": "Brief description of project, location, and requirements...",
  "Giới Thiệu Chung": "About Us",
  "© 2026 VIỆN NGHIÊN CỨU CHIẾN LƯỢC VÀ PHÁT TRIỂN LẠC HỒNG. All rights reserved.": "© 2026 LAC HONG INSTITUTE OF STRATEGIC RESEARCH & DEVELOPMENT. All rights reserved.",
  "Lĩnh Vực Hoạt Động | Lạc Hồng Digital - Viện Nghiên Cứu Lạc Hồng": "Key Sectors | Lac Hong Digital - Lac Hong Research Institute",
  "Lĩnh Vực Hoạt Động & Năng Lực": "Key Sectors & Capabilities",
  "Dự Án Tiêu Biểu | Lạc Hồng Digital - Viện Nghiên Cứu Lạc Hồng": "Featured Projects | Lac Hong Digital - Lac Hong Research Institute",
  "Quản trị Agile PMO": "Agile PMO Project Governance",
  "Tin Tức & Sự Kiện | Lạc Hồng Digital - Viện Nghiên Cứu Lạc Hồng": "News & Events | Lac Hong Digital - Lac Hong Research Institute",
  "Tin Tức & Sự Kiện": "News & Events",
  "Liên Hệ | Lạc Hồng Digital - Viện Nghiên Cứu Lạc Hồng": "Contact Us | Lac Hong Digital - Lac Hong Research Institute",
  "Liên Hệ & Hợp Tác": "Contact & Strategic Partnership"
};

  // 2. THÔNG ĐIỆP ĐA NGÔN NGỮ CHO HỆ THỐNG VÀ THÔNG BÁO (ALERTS / FORMS)
  const SYSTEM_MESSAGES = {
    submitting: {
      vi: '<i class="fas fa-spinner fa-spin"></i> Đang gửi yêu cầu...',
      en: '<i class="fas fa-spinner fa-spin"></i> Submitting request...'
    },
    contact_success: {
      vi: 'Cảm ơn Quý đối tác! Yêu cầu tư vấn / hợp tác đã được gửi thành công đến hòm thư contact@lachongdigital.vn. Chuyên gia Lạc Hồng Digital sẽ phản hồi trong vòng 24 giờ làm việc.',
      en: 'Thank you! Your consultation / partnership request has been successfully submitted to contact@lachongdigital.vn. A Lac Hong Digital specialist will respond within 24 working hours.'
    },
    cta_success: {
      vi: 'Cảm ơn Quý đối tác! Yêu cầu nhận hồ sơ năng lực & tư vấn đã được gửi thành công đến hòm thư contact@lachongdigital.vn. Chuyên viên Lạc Hồng Digital sẽ liên hệ sớm nhất.',
      en: 'Thank you! Your request for capability profile & consultation has been successfully submitted to contact@lachongdigital.vn. A Lac Hong Digital specialist will contact you shortly.'
    },
    submit_error: {
      vi: 'Có lỗi xảy ra khi gửi. Quý vị vui lòng thử lại hoặc liên hệ hotline: 0909.860.118!',
      en: 'An error occurred while submitting. Please try again or contact our hotline: 0909.860.118!'
    },
    submit_fail: {
      vi: 'Không thể kết nối đến máy chủ gửi thư. Quý vị vui lòng gọi hotline 0909.860.118 để được hỗ trợ tức thì!',
      en: 'Unable to connect to email server. Please call hotline 0909.860.118 for immediate support!'
    },
    newsletter_success: {
      vi: function (email) {
        return 'Cảm ơn bạn đã đăng ký nhận bản tin nghiên cứu và sự kiện từ Lạc Hồng Digital (' + email + ')!';
      },
      en: function (email) {
        return 'Thank you for subscribing to research updates and events from Lac Hong Digital (' + email + ')!';
      }
    },
    project_modal_default_title: {
      vi: 'Thông tin dự án',
      en: 'Project Details'
    }
  };

  // Cung cấp API toàn cục cho main.js truy xuất thông điệp
  window.LacHongI18n = {
    getLang: function () {
      return localStorage.getItem('lachong_lang') || 'vi';
    },
    getMessage: function (key, param) {
      const lang = window.LacHongI18n.getLang();
      const item = SYSTEM_MESSAGES[key];
      if (!item) return '';
      const val = item[lang] || item['vi'];
      if (typeof val === 'function') return val(param);
      return val;
    },
    translate: function (text) {
      if (!text) return '';
      const lang = window.LacHongI18n.getLang();
      if (lang === 'vi') return text;
      const trimmed = text.trim().replace(/\s+/g, ' ');
      return PHRASE_MAP[trimmed] || text;
    },
    addTranslation: function (vi, en) {
      if (!vi || !en) return;
      const trimmed = vi.trim().replace(/\s+/g, ' ');
      PHRASE_MAP[trimmed] = en;
    },
    getPhraseMap: function () {
      return PHRASE_MAP;
    }
  };

  // 3. HÀM CHUYỂN ĐỔI NGÔN NGỮ TOÀN DIỆN (APPLY LANGUAGE)
  function applyLanguage(lang) {
    const isEn = lang === 'en';

    // A. Cập nhật thuộc tính lang của thẻ <html>
    document.documentElement.lang = isEn ? 'en' : 'vi';

    // B. Cập nhật nút chuyển đổi VI | EN trên giao diện
    const langSwitches = document.querySelectorAll('.lang-switch');
    langSwitches.forEach(function (sw) {
      const links = sw.querySelectorAll('a');
      links.forEach(function (link) {
        const text = link.textContent.trim().toUpperCase();
        if ((isEn && text === 'EN') || (!isEn && text === 'VI')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    });

    // C. Cập nhật tiêu đề tài liệu (document.title)
    if (document._lhViTitle === undefined) {
      document._lhViTitle = document.title;
    }
    if (isEn) {
      const trimmed = document._lhViTitle.trim().replace(/\s+/g, ' ');
      if (PHRASE_MAP[trimmed]) {
        document.title = PHRASE_MAP[trimmed];
      }
    } else {
      document.title = document._lhViTitle;
    }

    // D. Duyệt toàn bộ Text Node trong <body> và thay thế nội dung
    if (document.body) {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {
            if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName;
            if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'CODE' || tag === 'PRE') {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest('.lang-switch')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let currentNode;
      while ((currentNode = walker.nextNode())) {
        if (currentNode._lhVi === undefined) {
          currentNode._lhVi = currentNode.nodeValue;
        }

        if (isEn) {
          const raw = currentNode._lhVi;
          const trimmed = raw.trim().replace(/\s+/g, ' ');
          if (PHRASE_MAP[trimmed]) {
            const lead = raw.match(/^\s*/)[0];
            const trail = raw.match(/\s*$/)[0];
            currentNode.nodeValue = lead + PHRASE_MAP[trimmed] + trail;
          }
        } else {
          currentNode.nodeValue = currentNode._lhVi;
        }
      }
    }

    // E. Cập nhật Placeholder & Title của các Input / Textarea
    const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    inputs.forEach(function (el) {
      if (el._lhViPlaceholder === undefined) {
        el._lhViPlaceholder = el.placeholder;
      }
      if (isEn) {
        const trimmed = el._lhViPlaceholder.trim().replace(/\s+/g, ' ');
        if (PHRASE_MAP[trimmed]) {
          el.placeholder = PHRASE_MAP[trimmed];
        }
      } else {
        el.placeholder = el._lhViPlaceholder;
      }
    });

    const titledElements = document.querySelectorAll('[title]');
    titledElements.forEach(function (el) {
      if (el._lhViTitle === undefined) {
        el._lhViTitle = el.getAttribute('title');
      }
      if (isEn) {
        const trimmed = (el._lhViTitle || '').trim().replace(/\s+/g, ' ');
        if (PHRASE_MAP[trimmed]) {
          el.setAttribute('title', PHRASE_MAP[trimmed]);
        }
      } else {
        el.setAttribute('title', el._lhViTitle);
      }
    });

    // F. Cập nhật các tuỳ chọn Dropdown (select option)
    const selectOptions = document.querySelectorAll('select option');
    selectOptions.forEach(function (opt) {
      if (opt._lhViText === undefined) {
        opt._lhViText = opt.text;
      }
      if (isEn) {
        const trimmed = opt._lhViText.trim().replace(/\s+/g, ' ');
        if (PHRASE_MAP[trimmed]) {
          opt.text = PHRASE_MAP[trimmed];
        }
      } else {
        opt.text = opt._lhViText;
      }
    });

    // G. Đồng bộ hoá dữ liệu tương tác Cây Giá Trị Cốt Lõi (gioi-thieu.html & mobile spotlight)
    window.LacHongCoreValues = {
      '1': isEn ? 'Everlasting Entrepreneurial Spirit' : 'Mãi mãi tinh thần Khởi nghiệp',
      '2': isEn ? 'Agility is Competitive Advantage' : 'Thích ứng nhanh là sức mạnh cạnh tranh',
      '3': isEn ? 'Right Decisions Outweigh Sheer Effort' : 'Lựa chọn đúng quan trọng hơn sự nỗ lực cố gắng',
      '4': isEn ? 'Growth Through Challenges and Failures' : 'Trưởng thành qua thách thức và thất bại',
      '5': isEn ? 'Standing Shoulder to Shoulder with the Nation' : 'Đồng hành, hiện diện, kề vai sát cánh và chung lưng đấu cật cùng dân tộc',
      '6': isEn ? 'Harmonizing Eastern Wisdom and Western Innovation' : 'Đông Tây kết hợp'
    };

    const cvSpotlightText = document.getElementById('cvSpotlightText');
    const cvSpotlightBadge = document.getElementById('cvSpotlightBadge');
    if (cvSpotlightText && cvSpotlightBadge) {
      const currentNum = cvSpotlightBadge.textContent.replace(/^0+/, '');
      if (window.LacHongCoreValues[currentNum]) {
        cvSpotlightText.textContent = window.LacHongCoreValues[currentNum];
      }
    }

    // H. Phát sự kiện languageChanged để các thành phần động có thể lắng nghe
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
  }

  // 4. KHỞI TẠO BỘ LẮNG NGHE SỰ KIỆN CLICK CHUYỂN ĐỔI NGÔN NGỮ
  function initLangSwitch() {
    const savedLang = localStorage.getItem('lachong_lang') || 'vi';

    const langSwitches = document.querySelectorAll('.lang-switch');
    langSwitches.forEach(function (sw) {
      const links = sw.querySelectorAll('a');
      links.forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const targetLang = this.textContent.trim().toLowerCase();
          if (targetLang === 'vi' || targetLang === 'en') {
            localStorage.setItem('lachong_lang', targetLang);
            applyLanguage(targetLang);
          }
        });
      });
    });

    applyLanguage(savedLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangSwitch);
  } else {
    initLangSwitch();
  }

  window.setLacHongLanguage = function (lang) {
    localStorage.setItem('lachong_lang', lang);
    applyLanguage(lang);
  };
})();
