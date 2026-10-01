import fs from "node:fs/promises";
import path from "node:path";
const LOCALES_DIR = path.resolve("packages/admin-ui/src/i18n/locales");
// English source copy followed by equivalent zh, zh-TW, fr, ja, ru and vi copy.
const rows = `
Enable selected records|启用选中记录|啟用選取的記錄|Activer la sélection|選択したレコードを有効化|Включить выбранные записи|Bật các bản ghi đã chọn
Disable selected records|停用选中记录|停用選取的記錄|Désactiver la sélection|選択したレコードを無効化|Отключить выбранные записи|Tắt các bản ghi đã chọn
Set tags|设置标签|設定標籤|Définir les étiquettes|タグを設定|Задать метки|Đặt nhãn
Replace tags on {{count}} selected records. Leave empty to clear tags.|替换 {{count}} 条选中记录的标签，留空可清除标签。|取代 {{count}} 筆選取記錄的標籤，留空可清除標籤。|Remplacez les étiquettes de {{count}} entrées. Laissez vide pour les supprimer.|選択した {{count}} 件のタグを置き換えます。空にするとタグを削除します。|Заменить метки у {{count}} выбранных записей. Оставьте пустым, чтобы удалить метки.|Thay nhãn cho {{count}} bản ghi đã chọn. Để trống để xóa nhãn.
Batch Operations|批量操作|大量操作|Opérations par lots|一括操作|Пакетные операции|Thao tác hàng loạt
Tag Mode|标签模式|標籤模式|Mode Balise|タグモード|Режим тегов|Chế độ thẻ
Sort by ID|使用 ID 排序|使用 ID 排序|Trier par ID|IDでソート|Сортировать по ID|Sắp xếp theo ID
Incomplete|未完成|未完成|Incomplet|未完了|Не завершено|Chưa hoàn tất
Error|错误|錯誤|Erreur|エラー|Ошибка|Lỗi
More actions|更多操作|更多操作|Autres actions|その他の操作|Другие действия|Thao tác khác
Form sections|表单分区|表單分區|Sections du formulaire|フォームのセクション|Разделы формы|Các phần biểu mẫu
Section navigation|分区导航|分區導覽|Navigation par section|セクションナビゲーション|Навигация по разделам|Điều hướng theo phần
{{complete}} of {{total}} sections complete|已完成 {{complete}} / {{total}} 个分区|已完成 {{complete}} / {{total}} 個分區|{{complete}} sections terminées sur {{total}}|{{total}} セクション中 {{complete}} 完了|Завершено разделов: {{complete}} из {{total}}|Hoàn thành {{complete}} / {{total}} phần
Untagged|无标签|無標籤|Sans étiquette|タグなし|Без метки|Không có nhãn
Grouped by the first tag. Counts refer to this page.|按首个标签分组，数量为当前页记录数。|依第一個標籤分組，數量為目前頁面的記錄數。|Regroupés par première étiquette. Les nombres concernent cette page.|最初のタグでグループ化。件数は現在のページのものです。|Группировка по первой метке. Количество указано для текущей страницы.|Nhóm theo nhãn đầu tiên. Số lượng thuộc trang hiện tại.
A complete list example. Keep the columns and actions your business needs.|完整列表示例，按业务需要保留列和操作。|完整清單範例，依業務需要保留欄位與操作。|Exemple complet de liste. Gardez les colonnes et actions utiles.|必要な列と操作を残して使える一覧の完全な例です。|Полный пример списка. Оставьте нужные столбцы и действия.|Ví dụ danh sách đầy đủ. Giữ các cột và thao tác cần thiết.
A reusable administration workspace|可复用的后台管理工作区|可重用的後台管理工作區|Un espace d’administration réutilisable|再利用できる管理ワークスペース|Многократно используемая панель управления|Không gian quản trị có thể tái sử dụng
A short, recognizable name|填写简短、易识别的名称|填寫簡短、易辨識的名稱|Un nom court et reconnaissable|短く分かりやすい名前|Короткое и понятное название|Tên ngắn gọn, dễ nhận biết
Action completed|操作完成|操作完成|Action effectuée|操作が完了しました|Действие выполнено|Đã hoàn tất thao tác
Activity|动态|動態|Activité|アクティビティ|Действия|Hoạt động
Activity trend|活动趋势|活動趨勢|Tendance d’activité|アクティビティの推移|Динамика активности|Xu hướng hoạt động
Add milestone|添加里程碑|新增里程碑|Ajouter un jalon|マイルストーンを追加|Добавить этап|Thêm cột mốc
Add or remove repeatable fields|添加或删除动态字段|新增或刪除動態欄位|Ajouter ou retirer des champs répétés|繰り返し項目を追加・削除|Добавляйте и удаляйте повторяющиеся поля|Thêm hoặc xóa các trường lặp lại
Alerts and notifications|提示与通知|提示與通知|Alertes et notifications|アラートと通知|Оповещения и уведомления|Cảnh báo và thông báo
All form controls and interactions in one editable example.|在完整可编辑示例中体验表单控件与交互。|在完整可編輯範例中體驗表單控制項與互動。|Tous les contrôles et interactions dans un exemple modifiable.|編集可能な例ですべてのフォーム操作を確認できます。|Все элементы и взаимодействия формы в редактируемом примере.|Tất cả điều khiển và tương tác trong một biểu mẫu có thể chỉnh sửa.
Appearance|外观|外觀|Apparence|外観|Внешний вид|Giao diện
Archive|归档|封存|Archiver|アーカイブ|Архивировать|Lưu trữ
Archived|已归档|已封存|Archivé|アーカイブ済み|В архиве|Đã lưu trữ
Back to list|返回列表|返回清單|Retour à la liste|一覧に戻る|К списку|Về danh sách
Badges and avatars|徽标与头像|徽章與頭像|Badges et avatars|バッジとアバター|Значки и аватары|Huy hiệu và ảnh đại diện
Basic components|基础组件|基礎元件|Composants de base|基本コンポーネント|Базовые компоненты|Thành phần cơ bản
Basic information|基本信息|基本資訊|Informations générales|基本情報|Основные сведения|Thông tin cơ bản
Between 1 and 1000|取值范围为 1–1000|數值範圍為 1–1000|Entre 1 et 1000|1〜1000 の範囲|От 1 до 1000|Từ 1 đến 1000
Bold|粗体|粗體|Gras|太字|Полужирный|Đậm
Bottom drawer|底部抽屉|底部抽屜|Panneau inférieur|下部ドロワー|Нижняя панель|Ngăn dưới
Breadcrumbs and menus|面包屑与菜单|麵包屑與選單|Fil d’Ariane et menus|パンくずとメニュー|Навигационная цепочка и меню|Điều hướng và menu
Buttons|按钮|按鈕|Boutons|ボタン|Кнопки|Nút
Capacity|容量|容量|Capacité|容量|Вместимость|Sức chứa
Carousel and aspect ratio|轮播与宽高比|輪播與長寬比|Carrousel et proportions|カルーセルとアスペクト比|Карусель и пропорции|Băng chuyền và tỷ lệ
Characters|字符|字元|Caractères|文字数|Символы|Ký tự
Code input|验证码输入|驗證碼輸入|Saisie de code|コード入力|Ввод кода|Nhập mã
Collapsible content|折叠内容|摺疊內容|Contenu repliable|折りたたみコンテンツ|Сворачиваемое содержимое|Nội dung thu gọn
Command search|命令搜索|命令搜尋|Recherche de commandes|コマンド検索|Поиск команд|Tìm lệnh
Complete form|完整表单|完整表單|Formulaire complet|完全なフォーム|Полная форма|Biểu mẫu đầy đủ
Complete form example|全功能表单示例|全功能表單範例|Exemple de formulaire complet|全機能フォームの例|Пример полной формы|Ví dụ biểu mẫu đầy đủ
Components|组件|元件|Composants|コンポーネント|Компоненты|Thành phần
Confirm action|确认操作|確認操作|Confirmer l’action|操作を確認|Подтвердить действие|Xác nhận thao tác
Contact|联系信息|聯絡資訊|Contact|連絡先|Контакты|Liên hệ
Content and layout|内容与布局|內容與版面配置|Contenu et mise en page|コンテンツとレイアウト|Содержимое и макет|Nội dung và bố cục
Context menu|右键菜单|快顯選單|Menu contextuel|コンテキストメニュー|Контекстное меню|Menu ngữ cảnh
Contextual information|上下文提示|情境提示|Informations contextuelles|補足情報|Контекстная информация|Thông tin ngữ cảnh
Control demonstration only; this value is not stored.|仅用于控件演示，此值不会保存。|僅供控制項示範，此值不會儲存。|Démonstration uniquement ; cette valeur n’est pas enregistrée.|操作例のみです。この値は保存されません。|Только демонстрация; значение не сохраняется.|Chỉ minh họa điều khiển; giá trị này không được lưu.
Copy a page, remove what you do not need, then connect your API.|复制页面，删掉不需要的部分，再接入你的 API。|複製頁面，刪除不需要的部分，再串接你的 API。|Copiez une page, retirez le superflu, puis connectez votre API.|ページをコピーし、不要な部分を削除して API に接続します。|Скопируйте страницу, удалите лишнее и подключите API.|Sao chép trang, xóa phần không cần và kết nối API.
Copy and reveal|复制与查看|複製與檢視|Copier et afficher|コピーと表示|Копирование и просмотр|Sao chép và hiển thị
Create in dialog|弹窗新建|彈窗新增|Créer dans une fenêtre|ダイアログで作成|Создать в диалоге|Tạo trong hộp thoại
Create in drawer|抽屉新建|抽屜新增|Créer dans un panneau|ドロワーで作成|Создать в панели|Tạo trong ngăn
Create project|新建项目|新增專案|Créer un projet|プロジェクトを作成|Создать проект|Tạo dự án
Current projects|当前项目|目前專案|Projets actuels|現在のプロジェクト|Текущие проекты|Dự án hiện tại
Customize theme, font, radius, density and layout|调整主题、字体、圆角、密度和布局|調整主題、字型、圓角、密度與版面配置|Personnalisez thème, police, arrondis, densité et disposition|テーマ、フォント、角丸、密度、レイアウトを調整|Настройте тему, шрифт, скругления, плотность и макет|Tùy chỉnh chủ đề, phông chữ, bo góc, mật độ và bố cục
Daily summary|每日摘要|每日摘要|Résumé quotidien|毎日の概要|Ежедневная сводка|Tóm tắt hàng ngày
Delete selected records?|删除选中记录？|刪除選取的記錄？|Supprimer les entrées sélectionnées ?|選択したレコードを削除しますか？|Удалить выбранные записи?|Xóa các bản ghi đã chọn?
Demo data|演示数据|示範資料|Données de démonstration|デモデータ|Демонстрационные данные|Dữ liệu mẫu
Demo data is stored in memory and resets on refresh.|演示数据保存在内存中，刷新页面后重置。|示範資料儲存在記憶體中，重新整理後重設。|Les données sont en mémoire et réinitialisées à l’actualisation.|デモデータはメモリに保存され、更新時にリセットされます。|Данные хранятся в памяти и сбрасываются при обновлении.|Dữ liệu mẫu được lưu trong bộ nhớ và đặt lại khi tải lại.
Demo only; no email is sent.|仅作演示，不会发送邮件。|僅供示範，不會傳送郵件。|Démonstration : aucun e-mail n’est envoyé.|デモのみです。メールは送信されません。|Демонстрация: письма не отправляются.|Chỉ minh họa; không gửi email.
Dialog|弹窗|彈窗|Fenêtre|ダイアログ|Диалог|Hộp thoại
Dialog content|弹窗内容|彈窗內容|Contenu de la fenêtre|ダイアログの内容|Содержимое диалога|Nội dung hộp thoại
Dialog form|弹窗表单|彈窗表單|Formulaire en fenêtre|ダイアログフォーム|Форма в диалоге|Biểu mẫu hộp thoại
Dialogs and drawers|弹窗与抽屉|彈窗與抽屜|Fenêtres et panneaux|ダイアログとドロワー|Диалоги и панели|Hộp thoại và ngăn
Discard changes?|放弃修改？|捨棄變更？|Abandonner les modifications ?|変更を破棄しますか？|Отменить изменения?|Bỏ thay đổi?
Draft|草稿|草稿|Brouillon|下書き|Черновик|Bản nháp
Drag, resize or collapse this window.|可以拖动、调整大小或折叠窗口。|可拖曳、調整大小或摺疊視窗。|Déplacez, redimensionnez ou repliez cette fenêtre.|このウィンドウを移動、サイズ変更、折りたたみできます。|Переместите, измените размер или сверните окно.|Kéo, đổi kích thước hoặc thu gọn cửa sổ.
Drawer form|抽屉表单|抽屜表單|Formulaire en panneau|ドロワーフォーム|Форма в панели|Biểu mẫu ngăn
Edit in dialog|弹窗编辑|彈窗編輯|Modifier dans une fenêtre|ダイアログで編集|Изменить в диалоге|Sửa trong hộp thoại
Edit in drawer|抽屉编辑|抽屜編輯|Modifier dans un panneau|ドロワーで編集|Изменить в панели|Sửa trong ngăn
Edit project|编辑项目|編輯專案|Modifier le projet|プロジェクトを編集|Изменить проект|Sửa dự án
Empty and error states|空状态与错误状态|空白與錯誤狀態|États vide et erreur|空とエラーの状態|Пустые состояния и ошибки|Trạng thái trống và lỗi
Enable notifications|启用通知|啟用通知|Activer les notifications|通知を有効化|Включить уведомления|Bật thông báo
Enter a JSON object|请输入 JSON 对象|請輸入 JSON 物件|Saisissez un objet JSON|JSON オブジェクトを入力|Введите объект JSON|Nhập đối tượng JSON
Examples|示例|範例|Exemples|サンプル|Примеры|Ví dụ
Fade transition|淡入动画|淡入動畫|Transition en fondu|フェードアニメーション|Плавное появление|Hiệu ứng mờ dần
Feedback and overlays|反馈与弹层|回饋與浮層|Retours et superpositions|フィードバックとオーバーレイ|Обратная связь и окна|Phản hồi và lớp phủ
Field error|字段错误|欄位錯誤|Erreur de champ|項目エラー|Ошибка поля|Lỗi trường
Fields respond to your selections|字段随选项变化联动|欄位隨選項變更連動|Les champs réagissent à vos choix|選択に応じて項目が変わります|Поля реагируют на ваш выбор|Các trường thay đổi theo lựa chọn
Floating window|浮动窗口|浮動視窗|Fenêtre flottante|フローティングウィンドウ|Плавающее окно|Cửa sổ nổi
Full value|完整内容|完整內容|Valeur complète|完全な値|Полное значение|Giá trị đầy đủ
General information and ownership|基本信息与负责人|基本資訊與負責人|Informations générales et responsable|基本情報と担当者|Основные сведения и ответственный|Thông tin chung và người phụ trách
Grouped settings with save, reset and appearance controls.|分组设置，包含保存、重置和外观调整。|分組設定，包含儲存、重設與外觀調整。|Paramètres groupés avec enregistrement, réinitialisation et apparence.|保存、リセット、外観調整を備えた設定です。|Группы настроек с сохранением, сбросом и оформлением.|Cài đặt theo nhóm với lưu, đặt lại và tùy chỉnh giao diện.
High|高|高|Haute|高|Высокий|Cao
Hover card|悬停卡片|懸停卡片|Carte au survol|ホバーカード|Карточка при наведении|Thẻ khi di chuột
How to reuse this template?|如何复用这个模板？|如何重用這個範本？|Comment réutiliser ce modèle ?|このテンプレートの再利用方法は？|Как использовать этот шаблон?|Cách tái sử dụng mẫu này?
Inactive|未启用|未啟用|Inactif|無効|Неактивен|Không hoạt động
Information|信息|資訊|Information|情報|Информация|Thông tin
Input groups|输入框组合|輸入框群組|Groupes de saisie|入力グループ|Группы полей ввода|Nhóm nhập liệu
Interactive examples of the shared component library.|共享组件库的交互式示例。|共享元件庫的互動範例。|Exemples interactifs de la bibliothèque partagée.|共有コンポーネントの操作例です。|Интерактивные примеры общей библиотеки компонентов.|Ví dụ tương tác của thư viện thành phần dùng chung.
Invalid email address|邮箱地址无效|電子郵件地址無效|Adresse e-mail invalide|メールアドレスが無効です|Неверный адрес электронной почты|Địa chỉ email không hợp lệ
Invalid input|输入无效|輸入無效|Saisie invalide|無効な入力|Неверный ввод|Dữ liệu nhập không hợp lệ
Italic|斜体|斜體|Italique|斜体|Курсив|Nghiêng
Items and scrolling|列表项与滚动|清單項目與捲動|Éléments et défilement|項目とスクロール|Элементы и прокрутка|Mục và cuộn
Language|语言|語言|Langue|言語|Язык|Ngôn ngữ
Library|组件库|元件庫|Bibliothèque|ライブラリ|Библиотека|Thư viện
Load edit example|加载编辑示例|載入編輯範例|Charger l’exemple à modifier|編集例を読み込む|Загрузить пример редактирования|Tải ví dụ chỉnh sửa
Loading and progress|加载与进度|載入與進度|Chargement et progression|読み込みと進捗|Загрузка и прогресс|Tải và tiến trình
Long text and motion|长文本与动画|長文字與動畫|Texte long et animations|長文とアニメーション|Длинный текст и анимации|Văn bản dài và chuyển động
Low|低|低|Basse|低|Низкий|Thấp
Maximum 1000 characters|最多 1000 个字符|最多 1000 個字元|1000 caractères maximum|最大 1000 文字|Не более 1000 символов|Tối đa 1000 ký tự
Maximum 80 characters|最多 80 个字符|最多 80 個字元|80 caractères maximum|最大 80 文字|Не более 80 символов|Tối đa 80 ký tự
Medium|中|中|Moyenne|中|Средний|Trung bình
Members|成员|成員|Membres|メンバー|Участники|Thành viên
Milestone|里程碑|里程碑|Jalon|マイルストーン|Этап|Cột mốc
Milestones|里程碑|里程碑|Jalons|マイルストーン|Этапы|Các cột mốc
Mobile-friendly content|适配移动端的内容|適合行動裝置的內容|Contenu adapté au mobile|モバイル対応コンテンツ|Содержимое для мобильных устройств|Nội dung thân thiện với di động
Must be at least 1|不能小于 1|不得小於 1|Doit être au moins 1|1 以上にしてください|Не менее 1|Phải ít nhất là 1
Must be at most 1000|不能大于 1000|不得大於 1000|Doit être au plus 1000|1000 以下にしてください|Не более 1000|Phải tối đa là 1000
Navigation|导航|導覽|Navigation|ナビゲーション|Навигация|Điều hướng
Navigation menu|导航菜单|導覽選單|Menu de navigation|ナビゲーションメニュー|Меню навигации|Menu điều hướng
New|新建|新增|Nouveau|新規|Создать|Mới
Normal|正常|正常|Normal|通常|Обычное|Bình thường
Notification email|通知邮箱|通知信箱|E-mail de notification|通知先メール|Почта для уведомлений|Email thông báo
Open dialog|打开弹窗|開啟彈窗|Ouvrir une fenêtre|ダイアログを開く|Открыть диалог|Mở hộp thoại
Open form|打开表单|開啟表單|Ouvrir le formulaire|フォームを開く|Открыть форму|Mở biểu mẫu
Owner|负责人|負責人|Responsable|担当者|Ответственный|Người phụ trách
Page examples|页面范例|頁面範例|Exemples de pages|ページ例|Примеры страниц|Ví dụ trang
Pagination|分页|分頁|Pagination|ページ切替|Разбиение на страницы|Phân trang
Please try again.|请重试。|請重試。|Veuillez réessayer.|もう一度お試しください。|Попробуйте ещё раз.|Vui lòng thử lại.
Popover|气泡弹层|浮動提示框|Fenêtre contextuelle|ポップオーバー|Всплывающее окно|Cửa sổ bật lên
Preview state|演示状态|示範狀態|État de l’aperçu|プレビュー状態|Состояние предпросмотра|Trạng thái xem trước
Project details|项目详情|專案詳情|Détails du projet|プロジェクト詳細|Сведения о проекте|Chi tiết dự án
Projects|项目列表|專案清單|Projets|プロジェクト|Проекты|Dự án
Quick view|快速查看|快速檢視|Aperçu rapide|クイック表示|Быстрый просмотр|Xem nhanh
Raw data|原始数据|原始資料|Données brutes|元データ|Исходные данные|Dữ liệu gốc
Read only|只读|唯讀|Lecture seule|読み取り専用|Только чтение|Chỉ đọc
Recent projects|最近项目|最近專案|Projets récents|最近のプロジェクト|Последние проекты|Dự án gần đây
Record not found|记录不存在|找不到記錄|Entrée introuvable|レコードが見つかりません|Запись не найдена|Không tìm thấy bản ghi
Related records|关联记录|關聯記錄|Entrées liées|関連レコード|Связанные записи|Bản ghi liên quan
Remove milestone|删除里程碑|刪除里程碑|Supprimer le jalon|マイルストーンを削除|Удалить этап|Xóa cột mốc
Research|调研|調研|Recherche|調査|Исследование|Nghiên cứu
Reset demo data|重置演示数据|重設示範資料|Réinitialiser les données|デモデータをリセット|Сбросить демоданные|Đặt lại dữ liệu mẫu
Reset form?|重置表单？|重設表單？|Réinitialiser le formulaire ?|フォームをリセットしますか？|Сбросить форму?|Đặt lại biểu mẫu?
Resizable panels|可调整面板|可調整面板|Panneaux redimensionnables|サイズ変更可能なパネル|Изменяемые панели|Bảng đổi kích thước
Restore defaults?|恢复默认设置？|還原預設設定？|Rétablir les valeurs par défaut ?|初期設定に戻しますか？|Восстановить настройки?|Khôi phục mặc định?
Restored|已恢复|已還原|Restauré|復元しました|Восстановлено|Đã khôi phục
Retry requested|已请求重试|已要求重試|Nouvelle tentative demandée|再試行を要求しました|Запрошен повтор|Đã yêu cầu thử lại
Rich content|富文本内容|豐富文字內容|Contenu enrichi|リッチコンテンツ|Форматированный контент|Nội dung đa dạng
Right to left|从右到左|由右至左|De droite à gauche|右から左|Справа налево|Từ phải sang trái
Right-click here|在这里点击右键|在此按滑鼠右鍵|Faites un clic droit ici|ここを右クリック|Щёлкните правой кнопкой здесь|Nhấp chuột phải tại đây
Sample password|示例密码|範例密碼|Mot de passe fictif|サンプルパスワード|Пример пароля|Mật khẩu mẫu
Sample weekly activity|每周活动示例数据|每週活動範例資料|Exemple d’activité hebdomadaire|週間アクティビティの例|Пример недельной активности|Hoạt động hàng tuần mẫu
Sans|无衬线|無襯線|Sans empattement|サンセリフ|Без засечек|Không chân
Save failed. Your changes are preserved.|保存失败，已保留你的输入。|儲存失敗，已保留你的輸入。|Échec de l’enregistrement. Vos modifications sont conservées.|保存に失敗しました。変更は保持されています。|Не удалось сохранить. Изменения сохранены в форме.|Lưu thất bại. Thay đổi của bạn được giữ lại.
Scheduled time|计划时间|排程時間|Heure planifiée|予定日時|Запланированное время|Thời gian lên lịch
Scheduling and notifications|计划与通知|排程與通知|Planification et notifications|スケジュールと通知|Планирование и уведомления|Lịch và thông báo
Scroll transition|滚动动画|捲動動畫|Animation au défilement|スクロールアニメーション|Анимация при прокрутке|Hiệu ứng cuộn
Search projects...|搜索项目…|搜尋專案…|Rechercher des projets…|プロジェクトを検索…|Поиск проектов…|Tìm dự án…
Search, select or create an item|搜索、选择或创建选项|搜尋、選擇或建立選項|Rechercher, choisir ou créer un élément|項目を検索、選択、作成|Найдите, выберите или создайте элемент|Tìm, chọn hoặc tạo mục
Selection controls|选择控件|選擇控制項|Contrôles de sélection|選択コントロール|Элементы выбора|Điều khiển lựa chọn
Serif|衬线|襯線|Avec empattement|セリフ|С засечками|Có chân
Show more|展开更多|展開更多|Afficher plus|さらに表示|Показать больше|Hiển thị thêm
Start date|开始日期|開始日期|Date de début|開始日|Дата начала|Ngày bắt đầu
Status distribution|状态分布|狀態分布|Répartition des statuts|ステータス分布|Распределение статусов|Phân bố trạng thái
Suspended|已暂停|已暫停|Suspendu|停止中|Приостановлен|Tạm dừng
Switch the preview state to edit this form.|切换演示状态后可编辑表单。|切換示範狀態後可編輯表單。|Changez l’état de l’aperçu pour modifier ce formulaire.|編集するにはプレビュー状態を切り替えてください。|Смените состояние предпросмотра для редактирования.|Đổi trạng thái xem trước để sửa biểu mẫu.
Team member|团队成员|團隊成員|Membre de l’équipe|チームメンバー|Участник команды|Thành viên nhóm
Template workspace|模板工作区|範本工作區|Espace de modèles|テンプレートワークスペース|Рабочая область шаблонов|Không gian mẫu
Theme preferences are saved automatically.|外观偏好会自动保存。|外觀偏好會自動儲存。|Les préférences d’apparence sont enregistrées automatiquement.|外観設定は自動保存されます。|Настройки оформления сохраняются автоматически.|Tùy chọn giao diện được lưu tự động.
This action removes the selected demo records.|将删除选中的演示记录。|將刪除選取的示範記錄。|Cette action supprime les entrées de démonstration sélectionnées.|選択したデモレコードを削除します。|Выбранные демонстрационные записи будут удалены.|Thao tác này xóa các bản ghi mẫu đã chọn.
This example uses demo data.|此示例使用演示数据。|此範例使用示範資料。|Cet exemple utilise des données de démonstration.|この例ではデモデータを使用します。|В примере используются демонстрационные данные.|Ví dụ này sử dụng dữ liệu mẫu.
This name is already in use|此名称已被使用|此名稱已被使用|Ce nom est déjà utilisé|この名前は使用されています|Это название уже используется|Tên này đã được sử dụng
Toggle Sidebar|切换侧边栏|切換側邊欄|Basculer la barre latérale|サイドバーを切り替え|Переключить боковую панель|Bật/tắt thanh bên
Tooltip|工具提示|工具提示|Infobulle|ツールチップ|Подсказка|Chú giải
Undo|撤销|復原|Annuler|元に戻す|Отменить|Hoàn tác
Undo notification|带撤销的通知|含復原的通知|Notification avec annulation|取り消し付き通知|Уведомление с отменой|Thông báo có hoàn tác
Unsaved changes will be discarded.|未保存的修改将被丢弃。|未儲存的變更將被捨棄。|Les modifications non enregistrées seront perdues.|未保存の変更は破棄されます。|Несохранённые изменения будут потеряны.|Thay đổi chưa lưu sẽ bị bỏ.
Update progress|更新进度|更新進度|Mettre à jour la progression|進捗を更新|Обновить прогресс|Cập nhật tiến trình
Updated at|更新时间|更新時間|Mis à jour le|更新日時|Время обновления|Cập nhật lúc
Variants and sizes|样式与尺寸|樣式與尺寸|Variantes et tailles|スタイルとサイズ|Варианты и размеры|Biến thể và kích thước
View all|查看全部|檢視全部|Tout voir|すべて表示|Показать всё|Xem tất cả
View projects|查看项目|檢視專案|Voir les projets|プロジェクトを表示|Просмотреть проекты|Xem dự án
Where is the data stored?|数据保存在哪里？|資料儲存在哪裡？|Où sont stockées les données ?|データはどこに保存されますか？|Где хранятся данные?|Dữ liệu được lưu ở đâu?
Workspace|工作区|工作區|Espace de travail|ワークスペース|Рабочая область|Không gian làm việc
Workspace name|工作区名称|工作區名稱|Nom de l’espace|ワークスペース名|Название рабочей области|Tên không gian làm việc
Workspace preferences|工作区偏好|工作區偏好|Préférences de l’espace|ワークスペース設定|Настройки рабочей области|Tùy chọn không gian làm việc
Your workspace at a glance. All figures use demo data.|工作区概览，所有指标均为演示数据。|工作區概覽，所有指標均為示範資料。|Votre espace en bref. Tous les chiffres sont fictifs.|ワークスペースの概要です。数値はすべてデモデータです。|Обзор рабочей области. Все показатели демонстрационные.|Tổng quan không gian làm việc. Tất cả số liệu là dữ liệu mẫu.
destructive|危险操作|危險操作|Destructif|危険な操作|Опасное действие|Nguy hiểm
ghost|轻量|輕量|Discret|ゴースト|Незаметный|Tối giản
lg|大号|大尺寸|Grand|大|Большой|Lớn
link|链接|連結|Lien|リンク|Ссылка|Liên kết
outline|描边|外框|Contour|アウトライン|Контур|Viền
secondary|次要|次要|Secondaire|セカンダリ|Вторичный|Phụ
sm|小号|小尺寸|Petit|小|Малый|Nhỏ
Mon|周一|週一|Lun.|月|Пн|T2
Tue|周二|週二|Mar.|火|Вт|T3
Wed|周三|週三|Mer.|水|Ср|T4
Thu|周四|週四|Jeu.|木|Чт|T5
Fri|周五|週五|Ven.|金|Пт|T6
Sat|周六|週六|Sam.|土|Сб|T7
Sun|周日|週日|Dim.|日|Вс|CN
Breadcrumbs|面包屑导航|麵包屑導覽|Fil d’Ariane|パンくずリスト|Навигационная цепочка|Điều hướng phân cấp
Delete row|删除行|刪除列|Supprimer la ligne|行を削除|Удалить строку|Xóa hàng
More|更多|更多|Plus|その他|Ещё|Thêm
More pages|更多页面|更多頁面|Plus de pages|その他のページ|Другие страницы|Thêm trang
Next slide|下一张|下一張|Diapositive suivante|次のスライド|Следующий слайд|Trang chiếu tiếp
Previous slide|上一张|上一張|Diapositive précédente|前のスライド|Предыдущий слайд|Trang chiếu trước
Remove tag|移除标签|移除標籤|Retirer l’étiquette|タグを削除|Удалить метку|Xóa nhãn
Time|时间|時間|Heure|時刻|Время|Thời gian
Toggle password visibility|切换密码可见性|切換密碼可見性|Afficher ou masquer le mot de passe|パスワード表示を切り替え|Показать или скрыть пароль|Hiện hoặc ẩn mật khẩu
`;
const locales = ["en", "zh", "zh-TW", "fr", "ja", "ru", "vi"];
const newKeys = Object.fromEntries(locales.map((locale) => [locale, {}]));
for (const row of rows.trim().split("\n")) {
  const parts = row.split("|");
  if (parts.length !== 7) throw new Error("Invalid translations: " + parts[0]);
  for (let i = 0; i < locales.length; i++)
    newKeys[locales[i]][parts[0]] = i === 0 ? parts[0] : parts[i];
}
for (const locale of locales) {
  const file = path.join(LOCALES_DIR, locale + ".json");
  const json = JSON.parse(await fs.readFile(file, "utf8"));
  Object.assign(json.translation, newKeys[locale]);
  json.translation = Object.fromEntries(
    Object.entries(json.translation).sort(([a], [b]) => a.localeCompare(b)),
  );
  await fs.writeFile(file, JSON.stringify(json, null, 2) + "\n");
  console.log(locale, Object.keys(newKeys[locale]).length);
}
