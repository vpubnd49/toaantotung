
import { Case, CaseGroup, CaseDetail, CaseStatus, CaseType } from '../types';

// This simulates your "cases.json" database
export const DB = {
  cases: [
    {
      id: 'CASE_CIVIL_DALAT_146',
      title: 'Tranh chấp quyền sử dụng đất tại số 12 Phan Bội Châu, Đà Lạt',
      caseNumber: '146/2022/TLST-DS',
      court: 'TAND Khu vực 1 - Lâm Đồng',
      status: CaseStatus.PENDING,
      type: CaseType.CIVIL,
      date: '07/11/2025',
    },
    {
      id: 'CASE_ADMIN_TRUNGNGUYEN',
      title: 'Vụ án Hành chính: Cty CP Cà phê Trung Nguyên kiện UBND Tỉnh Lâm Đồng',
      caseNumber: '578/TA-HC',
      court: 'TAND tỉnh Lâm Đồng',
      status: CaseStatus.PENDING,
      type: CaseType.ADMINISTRATIVE,
      date: '18/11/2025',
    },
    {
      id: 'CASE_ADMIN_VUTHIKHOI',
      title: 'Khiếu kiện Quyết định hành chính về quản lý đất đai (Bà Vũ Thị Khởi)',
      caseNumber: 'TLST-HC/2025',
      court: 'TAND Khu vực 1 - Lâm Đồng',
      status: CaseStatus.UPCOMING,
      type: CaseType.ADMINISTRATIVE,
      date: '02/12/2025',
    },
    {
      id: 'CASE_MADUCPHONG_01',
      title: 'Vụ án ông Mã Đức Phong kiện về đất đai tại Đức Trọng',
      caseNumber: '12/2025/TLST-HC',
      court: 'TAND tỉnh Lâm Đồng',
      status: CaseStatus.POSTPONED,
      type: CaseType.ADMINISTRATIVE,
      date: '2025-01-17',
    },
  ] as Case[],

  groups: [
    {
      id: 'g1',
      name: 'Các vụ án tranh chấp đất đai khu vực Hồ Xuân Hương',
      caseCount: 5,
      plaintiffs: ['Nguyễn Văn A', 'Trần Thị B', '...'],
      type: CaseType.CIVIL,
    },
  ] as CaseGroup[],

  // Map of Case ID to detailed data
  caseDetails: {
    // --- CASE 1: TRANH CHẤP DÂN SỰ (PHÙNG CÔNG MINH) ---
    'CASE_CIVIL_DALAT_146': {
      id: 'CASE_CIVIL_DALAT_146',
      title: 'Tranh chấp quyền sử dụng đất tại số 12 Phan Bội Châu, Đà Lạt',
      caseNumber: '146/2022/TLST-DS',
      court: 'TAND Khu vực 1 - Lâm Đồng',
      status: CaseStatus.PENDING,
      type: CaseType.CIVIL,
      date: '07/11/2025',
      judge: 'Thẩm phán Hoàng Thị Phương Chi',
      caseStage: 'Chuẩn bị xét xử',
      nextEventDate: 'Chưa ấn định',
      nextEventDescription: 'Đang đợi kết quả thẩm định bổ sung',
      parties: [
        { 
          role: 'Nguyên đơn', 
          name: 'Ông Phùng Công Minh & Bà Hoàng Thị Nhung', 
          representatives: [
             { name: 'Ông Phùng Công Minh (có mặt)', type: 'Tự bảo vệ' },
             { name: 'Bà Hoàng Thị Nhung (có mặt)', type: 'Tự bảo vệ' }
          ]
        },
        { 
          role: 'Bị đơn', 
          name: 'Ông Nguyễn Xuân Tuyên (Sinh năm 1946)', 
          representatives: [
            { name: 'Bà Lê Thị Kim Loan (SN 1999)', type: 'Ủy quyền (Văn bản 02/04/2024)' },
            { name: 'Luật sư Nguyễn Văn Tỉnh', type: 'Bảo vệ quyền lợi (Cty Luật TNHH Đại Nghĩa)' }
          ],
          hasHistory: true
        },
        { 
            role: 'Người có quyền lợi, nghĩa vụ liên quan',
            name: 'Nhiều cá nhân và tổ chức',
            representatives: [
                { name: 'Bà Nguyễn Thị Thụy', type: 'Cá nhân' },
                { name: 'Bà Nguyễn Thị Hải Tú', type: 'Cá nhân' },
                { name: 'Ông Nguyễn Hữu Toàn (Công an tỉnh Lâm Đồng)', type: 'Đại diện theo ủy quyền' },
                { name: 'Ông Nguyễn Mậu Hà (UBND TP Đà Lạt)', type: 'Đại diện theo pháp luật' },
                { name: 'Ông Trần Quốc Tường (UBND tỉnh Lâm Đồng)', type: 'Đại diện theo ủy quyền' }
            ]
        }
      ],
      challengedActions: [], // Vụ án dân sự thường không có quyết định hành chính bị kiện trong luồng này
      timeline: [
        {
          id: 'evt_meeting_01',
          date: '07/11/2025',
          time: '08:30',
          type: 'DOCUMENT',
          title: 'Phiên họp kiểm tra việc giao nộp, tiếp cận, công khai chứng cứ',
          summary: 'Thẩm phán Hoàng Thị Phương Chi chủ trì phiên họp. Các đương sự đã trình bày ý kiến. Tòa án công khai thêm các tài liệu chứng cứ mới thu thập được (Bản tự khai, Biên bản làm việc, Bản photo phiếu chi, v.v.).',
          docNumber: 'Thông báo kết quả phiên họp',
          statusTag: 'Đã hoàn tất',
          documentLink: '#'
        },
        {
          id: 'evt_thuly',
          date: '05/10/2022',
          type: 'DOCUMENT',
          title: 'Thụ lý vụ án',
          summary: 'Tòa án nhân dân TP Đà Lạt (nay là KV1) thụ lý vụ án số 146/2022/TLST-DS.',
          docNumber: '146/2022/TLST-DS',
          statusTag: 'Đã hoàn tất'
        }
      ],
      documents: [
          { title: 'Thông báo kết quả phiên họp', date: '07/11/2025', type: 'Thông báo' },
          { title: 'Biên bản lấy lời khai', date: '21/02/2022', type: 'Biên bản' },
          { title: 'Quyết định 455/QĐ-UB (cũ)', date: '25/09/1989', type: 'Quyết định' },
          { title: 'Văn bản 3152/UB', date: '19/08/2004', type: 'Công văn' }
      ]
    },

    // --- CASE 2: HÀNH CHÍNH (TRUNG NGUYÊN) ---
    'CASE_ADMIN_TRUNGNGUYEN': {
      id: 'CASE_ADMIN_TRUNGNGUYEN',
      title: 'Vụ án Hành chính: Cty CP Cà phê Trung Nguyên khởi kiện',
      caseNumber: '578/TA-HC',
      court: 'TAND tỉnh Lâm Đồng',
      status: CaseStatus.PENDING,
      type: CaseType.ADMINISTRATIVE,
      date: '18/11/2025',
      judge: 'Đang cập nhật',
      caseStage: 'Chuẩn bị xét xử',
      nextEventDate: 'Đang chờ Tòa ấn định',
      nextEventDescription: 'Chờ ý kiến chỉ đạo từ UBND Tỉnh',
      parties: [
        {
          role: 'Người khởi kiện',
          name: 'Công ty Cổ phần Cà phê Trung Nguyên',
          representatives: []
        },
        {
          role: 'Người bị kiện',
          name: 'Ủy ban nhân dân tỉnh Lâm Đồng',
          representatives: [
              { name: 'Sở Nông nghiệp và PTNT', type: 'Tham mưu văn bản' }
          ]
        }
      ],
      challengedActions: [
         {
            step: 1,
            docType: 'Giấy chứng nhận QSDĐ',
            docNumber: 'T 418459 & T 418460',
            issuer: 'UBND tỉnh Lâm Đồng',
            date: '24/04/2002'
         },
         {
            step: 2,
            docType: 'Văn bản hành chính',
            docNumber: '5587/UBND-ĐC',
            issuer: 'UBND tỉnh Lâm Đồng',
            date: '25/08/2017'
         }
      ],
      timeline: [
        {
            id: 'evt_snnmt',
            date: '18/11/2025',
            type: 'DOCUMENT',
            title: 'Sở NN&PTNT báo cáo ý kiến bổ sung',
            summary: 'Sở Nông nghiệp và PTNT có văn bản số 6490/SNNMT-PC gửi UBND Tỉnh. Nội dung: Rà soát nguồn gốc đất (chuyển nhượng từ Trà Tiến Đạt II sang Trung Nguyên), quá trình cấp GCNQSDĐ và kiến nghị tham mưu văn bản gửi Tòa án.',
            docNumber: '6490/SNNMT-PC',
            statusTag: 'Đang xử lý',
            documentLink: '#'
        },
        {
            id: 'evt_ubnd_chidao',
            date: '28/10/2025',
            type: 'REQUEST',
            title: 'Chỉ đạo của Chủ tịch UBND Tỉnh',
            summary: 'Công văn số 6070/UBND-NC về việc giao Sở NN&PTNT trình bày ý kiến bổ sung vụ án.',
            docNumber: '6070/UBND-NC',
            statusTag: 'Đã hoàn tất'
        },
        {
            id: 'evt_toa_yeucau',
            date: '22/10/2025',
            type: 'REQUEST',
            title: 'Tòa án yêu cầu cung cấp ý kiến',
            summary: 'TAND tỉnh Lâm Đồng ban hành công văn yêu cầu UBND tỉnh có ý kiến bổ sung đối với vụ án.',
            docNumber: '578/TA-HC',
            statusTag: 'Đã hoàn tất'
        }
      ],
      documents: [
          { title: 'Báo cáo 6490/SNNMT-PC', date: '18/11/2025', type: 'Báo cáo' },
          { title: 'Dự thảo văn bản gửi Tòa án', date: '18/11/2025', type: 'Dự thảo' },
          { title: 'Hợp đồng chuyển nhượng 95/CN', date: '14/05/2002', type: 'Hợp đồng' }
      ]
    },

    // --- CASE 3: HÀNH CHÍNH (VŨ THỊ KHỞI) ---
    'CASE_ADMIN_VUTHIKHOI': {
      id: 'CASE_ADMIN_VUTHIKHOI',
      title: 'Khiếu kiện Quyết định hành chính trong quản lý Nhà nước về đất đai (Bà Vũ Thị Khởi)',
      caseNumber: 'TLST-HC/2025',
      court: 'TAND Khu vực 1 - Lâm Đồng',
      status: CaseStatus.UPCOMING,
      type: CaseType.ADMINISTRATIVE,
      date: '02/12/2025',
      judge: 'Đang cập nhật',
      caseStage: 'Sơ thẩm',
      nextEventDate: 'Đang cập nhật',
      nextEventDescription: 'Tham gia tố tụng theo ủy quyền',
      parties: [
        {
            role: 'Người khởi kiện',
            name: 'Bà Vũ Thị Khởi',
            representatives: []
        },
        {
            role: 'Người bị kiện (Bên ủy quyền)',
            name: 'Ông Hồ Văn Mười - Chủ tịch UBND Tỉnh Lâm Đồng',
            representatives: [
                { name: 'Ông Lê Trọng Yên - PCT UBND Tỉnh', type: 'Được ủy quyền (thay mặt tham gia tố tụng)' }
            ]
        }
      ],
      challengedActions: [],
      timeline: [
        {
            id: 'evt_uyquyen',
            date: '02/12/2025',
            type: 'DOCUMENT',
            title: 'Ủy quyền tham gia tố tụng',
            summary: 'Chủ tịch UBND Tỉnh (Ông Hồ Văn Mười) ủy quyền cho Phó Chủ tịch (Ông Lê Trọng Yên) thay mặt tham gia tố tụng, giải quyết vụ án khiếu kiện của bà Vũ Thị Khởi.',
            docNumber: 'Giấy Ủy Quyền',
            statusTag: 'Đã hoàn tất',
            documentLink: '#'
        }
      ],
      documents: [
          { title: 'Giấy Ủy Quyền', date: '02/12/2025', type: 'Văn bản pháp lý' }
      ]
    },

    // --- CASE 4: MÃ ĐỨC PHONG (Giữ lại làm mẫu cũ) ---
    'CASE_MADUCPHONG_01': {
      id: 'CASE_MADUCPHONG_01',
      title: 'Vụ án ông Mã Đức Phong kiện về đất đai tại Đức Trọng',
      caseNumber: '12/2025/TLST-HC',
      court: 'TAND tỉnh Lâm Đồng',
      status: CaseStatus.POSTPONED,
      type: CaseType.ADMINISTRATIVE,
      date: '2025-01-17',
      judge: 'Thẩm phán Trần Văn Minh',
      caseStage: 'Sơ thẩm',
      nextEventDate: '07/08/2025',
      nextEventDescription: 'Phiên tòa sơ thẩm (mở lại)',
      parties: [
        { 
          role: 'Nguyên đơn', 
          name: 'Ông Mã Đức Phong',
          representatives: [
            { name: 'Bà Nguyễn Thị Hạnh', type: 'Ủy quyền' },
            { name: 'Luật sư Đỗ Quốc Anh', type: 'Bảo vệ quyền lợi' }
          ],
          hasHistory: true
        },
        { 
          role: 'Bị đơn', 
          name: 'Chủ tịch UBND tỉnh Lâm Đồng', 
          representatives: [] // Vắng mặt
        },
        { 
          role: 'Bị đơn', 
          name: 'Chủ tịch UBND huyện Đức Trọng', 
          representatives: []
        }
      ],
      challengedActions: [
        { 
          step: 1, 
          docType: 'Văn bản trả lời đơn', 
          docNumber: '1450/UBND-ĐT', 
          issuer: 'UBND huyện Đức Trọng', 
          date: '25/12/2023' 
        },
        { 
          step: 2, 
          docType: 'Quyết định giải quyết khiếu nại (lần đầu)', 
          docNumber: '66/QĐ-UBND-ĐT', 
          issuer: 'Chủ tịch UBND huyện Đức Trọng', 
          date: '11/06/2024' 
        },
        { 
          step: 3, 
          docType: 'Quyết định giải quyết khiếu nại (lần hai)', 
          docNumber: '20/QĐ-UBND', 
          issuer: 'Chủ tịch UBND tỉnh Lâm Đồng', 
          date: '03/01/2025' 
        }
      ],
      timeline: [
        {
          id: 'e4',
          date: '07/08/2025',
          time: '09:00',
          type: 'TRIAL',
          title: 'Xét xử sơ thẩm',
          summary: 'Lịch xét xử sơ thẩm (mở lại).',
          docNumber: '245/2025/QĐST-HPT',
          statusTag: 'Sắp diễn ra'
        },
        {
          id: 'e3',
          date: '04/08/2025',
          type: 'POSTPONEMENT',
          title: 'Hoãn phiên tòa',
          summary: 'Tòa án ra quyết định hoãn phiên tòa sơ thẩm.',
          reason: 'Vắng mặt người đại diện theo ủy quyền của người bị kiện Chủ tịch UBND tỉnh Lâm Đồng.',
          docNumber: '245/2025/QĐST-HPT',
          statusTag: 'Đã hoàn tất'
        },
        {
          id: 'e2',
          date: '27/02/2025',
          time: '14:00',
          type: 'ONSITE',
          title: 'Thẩm định tại chỗ',
          summary: 'Tòa án tiến hành đo đạc, xem xét, thẩm định tại chỗ thửa đất tranh chấp.',
          docNumber: '14/QĐ-ĐĐXXTĐTC',
          statusTag: 'Đã hoàn tất',
          documentLink: '#'
        },
        {
          id: 'e1',
          date: '17/01/2025',
          type: 'DOCUMENT',
          title: 'Thụ lý vụ án',
          summary: 'Tòa án thụ lý vụ án hành chính.',
          docNumber: '12/2025/TLST-HC',
          statusTag: 'Đã hoàn tất',
          documentLink: '#'
        }
      ],
      documents: [
          { title: 'Quyết định đưa vụ án ra xét xử', date: '01/08/2025', type: 'Quyết định' },
          { title: 'Biên bản thẩm định tại chỗ', date: '27/02/2025', type: 'Biên bản' },
          { title: 'Thông báo thụ lý vụ án', date: '17/01/2025', type: 'Thông báo' },
          { title: 'Đơn khởi kiện bổ sung', date: '10/01/2025', type: 'Đơn từ' }
      ]
    }
  } as Record<string, CaseDetail>
};
