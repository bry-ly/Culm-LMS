# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2](https://github.com/bry-ly/Culm-LMS/compare/v1.0.1...v1.0.2) (2026-02-07)


### Bug Fixes

* ci improvements, dependency updates, and uploader fix ([#28](https://github.com/bry-ly/Culm-LMS/issues/28)) ([af93ebc](https://github.com/bry-ly/Culm-LMS/commit/af93ebc7f5546293097c4e38ad54b4b186135cf4))
* **ci:** disable subject-case rule to allow mixed case in commits ([5f4df4a](https://github.com/bry-ly/Culm-LMS/commit/5f4df4aa5453610502df6cb7546341ba9f1a9a0e))
* **ci:** replace missing pr-description-checker action ([725c625](https://github.com/bry-ly/Culm-LMS/commit/725c6257e2ad40e0ebbfff4aab5a2553ae4f3bdc))
* **ci:** use github-script for pr description check ([e6c0f93](https://github.com/bry-ly/Culm-LMS/commit/e6c0f939b088aaa0c07758dc47abeaa74f234adb))
* **dependabot:** target dev branch for dependency updates ([a7799bb](https://github.com/bry-ly/Culm-LMS/commit/a7799bbed8ea9e193df0eb848ad941012e1bc6c0))
* **deps:** improve dependabot config and fix CI checks ([#24](https://github.com/bry-ly/Culm-LMS/issues/24)) ([61cc983](https://github.com/bry-ly/Culm-LMS/commit/61cc983f8a3c4b44cae1ce3877ddda84b4cb8b4a))
* **uploader:** hide empty uploader when objectUrl exists ([6f1e5c6](https://github.com/bry-ly/Culm-LMS/commit/6f1e5c69a82c7a2eb35d0be3f9d6bfc3b393c89c))

## [1.0.1](https://github.com/bry-ly/Culm-LMS/compare/v1.0.0...v1.0.1) (2026-02-04)

### Bug Fixes

- **dependabot:** remove duplicate deps scope from commit messages ([#21](https://github.com/bry-ly/Culm-LMS/issues/21)) ([0e8b51e](https://github.com/bry-ly/Culm-LMS/commit/0e8b51eeb8b82866fdbe5986a0b1281cdb2ade80))

## 1.0.0 (2026-02-04)

### Features

- actions server ([98da95f](https://github.com/bry-ly/Culm-LMS/commit/98da95f02dd9f6612d1ccb4e9c5b3db58a50cfec))
- add @tiptap/html and html-react-parser dependencies for enhanced text processing ([ecb0fd8](https://github.com/bry-ly/Culm-LMS/commit/ecb0fd8ed4d2961d9a939c377c991f28ac025d29))
- add @tiptap/html and html-react-parser dependencies to enhance text editing capabilities ([e58eb6c](https://github.com/bry-ly/Culm-LMS/commit/e58eb6c5b7fe2d77a6f2019463222aa06d34a447))
- Add a highly customizable and animated theme toggle component and a payment success page. ([361a8a6](https://github.com/bry-ly/Culm-LMS/commit/361a8a6b7e8cc3df8bf91035ab41dfbd201c1878))
- add AdminCourseCard component for displaying course details with edit, preview, and delete options ([50e7818](https://github.com/bry-ly/Culm-LMS/commit/50e78186d026b2a08c8fa1faa395bf88569bc40b))
- add AdminCoursesCardSkeleton component for loading state representation in course cards ([da8e478](https://github.com/bry-ly/Culm-LMS/commit/da8e47877f3c5b4821c951ed7f9a71ac4366579f))
- add adminGetLesson function to retrieve lesson details with admin validation ([6b4abe4](https://github.com/bry-ly/Culm-LMS/commit/6b4abe406aad483c8879543d4f4870b68645dc21))
- add AdminLayout component for admin page structure and sidebar integration ([5bc7890](https://github.com/bry-ly/Culm-LMS/commit/5bc7890a9d93348a85469bb78b4899f6a7d04ccf))
- add ApiResponse type for standardized API responses ([8d666ee](https://github.com/bry-ly/Culm-LMS/commit/8d666eee89ce3e2179aab865039d193d34783ce8))
- add apple icon SVG for application branding ([36b2341](https://github.com/bry-ly/Culm-LMS/commit/36b234176bee2669f3f5e359363ae84a0a885aa7))
- add application icon image ([e314248](https://github.com/bry-ly/Culm-LMS/commit/e314248459935fbb78e9bfe2bb9c1ff5a93fdfbb))
- add application icons for improved branding ([f914156](https://github.com/bry-ly/Culm-LMS/commit/f914156e245a0fbb7533ab89aae57e5553b5241f))
- add AppSidebar component for navigation and user access ([35c35b5](https://github.com/bry-ly/Culm-LMS/commit/35c35b55fb1e829f9f26b213994342ecc752f7f8))
- add authClient for better authentication handling ([d78cd0c](https://github.com/bry-ly/Culm-LMS/commit/d78cd0cdf2c65dbf0fefa433553f6b0d41352cfd))
- add AuthLayout component for authentication pages ([bbbe6a9](https://github.com/bry-ly/Culm-LMS/commit/bbbe6a932972edae549a4b40325988687250a3f1))
- add bottom margin to main content area for improved layout spacing ([3f512db](https://github.com/bry-ly/Culm-LMS/commit/3f512db6e4e53c577c008f7ec07e5a536b351b4a))
- add Button component import to EditCourse page ([5132838](https://github.com/bry-ly/Culm-LMS/commit/5132838d56edbf604c9242c5d869adf22261056b))
- add ChartAreaInteractive component for displaying interactive area chart ([8a8b4e6](https://github.com/bry-ly/Culm-LMS/commit/8a8b4e62eb231b801c4a691f9a772c84f623fc6d))
- add CourseCreationPage component for creating new courses with form validation and slug generation ([cef3ccc](https://github.com/bry-ly/Culm-LMS/commit/cef3ccc90d11768f65e303c3f2c139e8cad68a35))
- add data.json file for project documentation and reviewer assignments ([88e2585](https://github.com/bry-ly/Culm-LMS/commit/88e258556ca531c40692951bf691ee025a90f977))
- add deleteCourse function to handle course deletion with admin validation ([d0413d7](https://github.com/bry-ly/Culm-LMS/commit/d0413d7d90071430c528b5999270d1f5d96b9bdd))
- add DeleteLesson component with confirmation dialog for lesson deletion ([0c15e3f](https://github.com/bry-ly/Culm-LMS/commit/0c15e3f341ad9453c945fae10144457f85bb56a7))
- add editCourse function for updating course details with admin validation ([1f6aa94](https://github.com/bry-ly/Culm-LMS/commit/1f6aa94a9862acad1f141fd546502ef61cdcbe86))
- add EditCourseForm component for course editing with validation and rich text support ([1be191a](https://github.com/bry-ly/Culm-LMS/commit/1be191a2773bb5f4903ba32d385718cc4d89a982))
- add EditRoute component for editing course details with tabbed interface ([c0c6e15](https://github.com/bry-ly/Culm-LMS/commit/c0c6e15d0a57c1ad805db09b719d644bd2e89946))
- add EmptyState components for courses and chapters with animations and create course link ([9aa960d](https://github.com/bry-ly/Culm-LMS/commit/9aa960db39c1f692d4fb4656cac7cfc18491732d))
- add environment configuration setup using createEnv and zod ([ee55357](https://github.com/bry-ly/Culm-LMS/commit/ee553570c3cd596f933dfa92cf0cd201b3b3887f))
- add getIndividualCourse function to retrieve course details by slug ([90e8174](https://github.com/bry-ly/Culm-LMS/commit/90e81742144ef645df0933076135528cfa57cf9e))
- add GoogleLogo component for displaying Google logo ([2ab75bb](https://github.com/bry-ly/Culm-LMS/commit/2ab75bb59396ff6ff5040d1f48e6b041161fa73f))
- add Home page with features and navigation links ([433c3ff](https://github.com/bry-ly/Culm-LMS/commit/433c3ff5c1967883043f0536409e9ee852d4b28a))
- add initial Prisma configuration file ([a529b23](https://github.com/bry-ly/Culm-LMS/commit/a529b237e3905b45de5462e255f39ca308db9f28))
- add initial Prisma schema with models for User, Session, Account, Verification, Course, Chapter, and Lesson ([40a1dca](https://github.com/bry-ly/Culm-LMS/commit/40a1dcae1d8eca4aa23b04dd6e35e9f65883563c))
- add LayoutPublic component for public page layout with Navbar ([a57955b](https://github.com/bry-ly/Culm-LMS/commit/a57955ba4668f3086b9a342bfcc0e7613d029961))
- add LoginForm component for user authentication with social and email options ([de09a43](https://github.com/bry-ly/Culm-LMS/commit/de09a437f7ebc788f33dd7f2378aac235fb229eb))
- add LoginPage component for user authentication ([5ea7089](https://github.com/bry-ly/Culm-LMS/commit/5ea7089635ae2abb80404a2cdc43d20156878b5c))
- add Logo component for displaying application logo ([20a9207](https://github.com/bry-ly/Culm-LMS/commit/20a9207d976f4bd316d9df5bf825f0d8a84e8ef2))
- add Logo component for displaying the application logo ([3dffc36](https://github.com/bry-ly/Culm-LMS/commit/3dffc3660958416b636b4188e97179e13c610b08))
- add Menubar component for rich text editing controls ([b8e7aa6](https://github.com/bry-ly/Culm-LMS/commit/b8e7aa6f85362af7938431944c73ed7469435556))
- add Navbar component with navigation links and user authentication options ([b1e1b51](https://github.com/bry-ly/Culm-LMS/commit/b1e1b51b6760e192b3dfad708a6de40ba4b90ed0))
- add NavMain component for sidebar navigation with dynamic menu items ([89edb6b](https://github.com/bry-ly/Culm-LMS/commit/89edb6b7ef4c01ad284b5f471885a5b04c77da0c))
- add NavSecondary component for secondary sidebar navigation with dynamic menu items ([255cd5c](https://github.com/bry-ly/Culm-LMS/commit/255cd5cdd7e2db51b4b8d4b3696e499ff5e27674))
- add NavUser component for user profile and navigation with dropdown menu ([c0d6c2a](https://github.com/bry-ly/Culm-LMS/commit/c0d6c2a5b0f57beac6a42b81095e465d63da0af1))
- add NewLessonModal component for creating new lessons in course management ([496a3f6](https://github.com/bry-ly/Culm-LMS/commit/496a3f69370dff254bcccd1a814c2d10bfae5c55))
- add payment success and cancel pages, a theme toggle component, and a dynamic course detail page. ([8bacb0f](https://github.com/bry-ly/Culm-LMS/commit/8bacb0fa13f93b484ef70bd645ba040be4aa457c))
- add payment success and cancel pages, and a theme toggle component ([7bd5419](https://github.com/bry-ly/Culm-LMS/commit/7bd5419c98545a018a0486a48357f63236e7d2fe))
- add Prisma client setup with PostgreSQL adapter ([4da0588](https://github.com/bry-ly/Culm-LMS/commit/4da0588447ad16491498592a3c89fbbbd9015951))
- Add public course detail page and initial authentication module. ([7976e05](https://github.com/bry-ly/Culm-LMS/commit/7976e0566f7a253271b81e95f148890632404880))
- add PublicCoursesRoute component for displaying available courses ([c88cdc5](https://github.com/bry-ly/Culm-LMS/commit/c88cdc5fb95aae421d8b9906903469724564ca39))
- add registry for [@ncdai](https://github.com/ncdai) to components.json for external resource management ([729c180](https://github.com/bry-ly/Culm-LMS/commit/729c18032f38b348184856d6d3fd440b59a0a793))
- add RenderDescription component for rendering rich text content ([3792088](https://github.com/bry-ly/Culm-LMS/commit/3792088ca10c4b4c8dbb11252ffb1b4b86202d34))
- add requireAdmin function for session validation and admin role check ([d0c6522](https://github.com/bry-ly/Culm-LMS/commit/d0c6522ce7c06c17c037a75b127f0bf1430eae0f))
- add Resend integration for email handling ([da0d63b](https://github.com/bry-ly/Culm-LMS/commit/da0d63bc9d20141dcdaecc38b6f38aa7c2958eb7))
- add RichTextEditor component for rich text editing functionality ([9111a65](https://github.com/bry-ly/Culm-LMS/commit/9111a65eac7e9e5c2a16fe3fbb3384205dc6fbe1))
- add S3 client setup for AWS S3 integration ([6fb056f](https://github.com/bry-ly/Culm-LMS/commit/6fb056f1f6040b68f339cb75308b039aa06507d8))
- add SectionCards component for displaying key metrics with trend indicators ([63ec8a6](https://github.com/bry-ly/Culm-LMS/commit/63ec8a6e0be3d8317ec82f93b215c8d345579544))
- add ShimmeringText component for animated text effects ([ba9990d](https://github.com/bry-ly/Culm-LMS/commit/ba9990d74147852754bfee2ed9c640b69936f860))
- add SiteHeader component for the main application header with navigation and theme toggle ([44929ca](https://github.com/bry-ly/Culm-LMS/commit/44929ca20dcdcde7f7a07d8a887b0f8fb51447c1))
- add SVG icon for application branding ([71f9ee0](https://github.com/bry-ly/Culm-LMS/commit/71f9ee040b00905cca4e1d7a39271a3b14fee15f))
- add theme toggle component with various animation variants and configuration options ([434a738](https://github.com/bry-ly/Culm-LMS/commit/434a7387ffb94f29ecea47e56dd977b373cf85ad))
- add ToggleGroup and Toggle components for enhanced toggle functionality ([277f073](https://github.com/bry-ly/Culm-LMS/commit/277f07392d7d3a6af9c9d100a7dc097f0cdfa2e5))
- add transactional emails, SEO improvements, and CI/CD pipeline ([#5](https://github.com/bry-ly/Culm-LMS/issues/5)) ([cb2c058](https://github.com/bry-ly/Culm-LMS/commit/cb2c058673530d75ae4f4d910a7ee56c4be7db8c))
- add tryCatch utility function for handling promises with success and error results ([bb5d1aa](https://github.com/bry-ly/Culm-LMS/commit/bb5d1aa6ae9ec82cecd642664fc8ec04c05fcc83))
- add UnauthorizedError component for handling access denial ([8271ec3](https://github.com/bry-ly/Culm-LMS/commit/8271ec3e6c84df81354171994b0875ae35f82485))
- add updateLesson function for admin to modify lesson details ([322e8a1](https://github.com/bry-ly/Culm-LMS/commit/322e8a111de25d147c3a1d2a092e676d97c435d3))
- add useConstructUrl hook for generating S3 image URLs ([7cd4f1e](https://github.com/bry-ly/Culm-LMS/commit/7cd4f1ed379a1bf5e8a351b03c9d56411f73d845))
- add useIsMobile hook for detecting mobile device viewport ([80eab5b](https://github.com/bry-ly/Culm-LMS/commit/80eab5bb4c1a56e9d1e8bf2422da4dd82406c42d))
- add UserDropdown component for user profile and navigation options ([e54783c](https://github.com/bry-ly/Culm-LMS/commit/e54783cecaf4e2bdeb5c5c8d5393d3e032a54986))
- add useSignout hook for handling user sign-out functionality ([7bfcc7d](https://github.com/bry-ly/Culm-LMS/commit/7bfcc7de727ab14c4ee785906247ad178de62266))
- add utility function for conditional class names using clsx and tailwind-merge ([163b9ec](https://github.com/bry-ly/Culm-LMS/commit/163b9ec15d35d05b4dcf3e30efb4b78653fde1e8))
- add VerifyRequest component for email OTP verification ([ab533f5](https://github.com/bry-ly/Culm-LMS/commit/ab533f55d6b6728e04737bf92c677c9b40c93fe7))
- add zod schemas for course validation and types ([b2572cf](https://github.com/bry-ly/Culm-LMS/commit/b2572cfae6c3248b1ed6ae90c8127e874c18f967))
- **admin:** add deleteCourse server action ([13611a2](https://github.com/bry-ly/Culm-LMS/commit/13611a2703392c93fd913101a0ad239afc2e741e))
- **admin:** add DeleteCourseModal component ([0ab3a84](https://github.com/bry-ly/Culm-LMS/commit/0ab3a8432757cc77bef573ebf06d3d8248ffb0a0))
- **admin:** add error boundary and loading state ([572488f](https://github.com/bry-ly/Culm-LMS/commit/572488fe585362239c1e20e40c9e3f42f84210c0))
- **app:** add global error boundary ([a9e5161](https://github.com/bry-ly/Culm-LMS/commit/a9e5161fd31a1f6bbddb700e1e4ff6d3b10ce41b))
- **app:** expand course, admin, and dashboard flows ([de5fc38](https://github.com/bry-ly/Culm-LMS/commit/de5fc38ff1a7a7f5c1c3925f2274079f29d37519))
- **assets:** add new app icon ([b8dc09c](https://github.com/bry-ly/Culm-LMS/commit/b8dc09cb101636d9deb624adaf1a064763c954ca))
- **auth-client:** add lastLoginMethod plugin support ([f2997b3](https://github.com/bry-ly/Culm-LMS/commit/f2997b3ae3cb170d6fa23254ed23b6956907ded7))
- **auth:** add welcome email and lastLoginMethod plugin ([732f8e0](https://github.com/bry-ly/Culm-LMS/commit/732f8e0fd7d18f693721c7b38dd4fe9b29124ea8))
- **components:** update ui and uploader components ([11207b9](https://github.com/bry-ly/Culm-LMS/commit/11207b9162e8fc93f77f6dea59863bba8769d138))
- **courses:** add error boundary for course pages ([63a3399](https://github.com/bry-ly/Culm-LMS/commit/63a3399f54ae650faa41ac784219d216898b4025))
- create AdminIndexPage component for admin dashboard layout ([6b62b05](https://github.com/bry-ly/Culm-LMS/commit/6b62b05535c21be75cf39358da7ec21b17a92702))
- create DeleteCoursePage component for course deletion with confirmation and error handling ([2d71cb7](https://github.com/bry-ly/Culm-LMS/commit/2d71cb7566077f524193f802d6a2bed1213633bb))
- create LessonIdPage component to fetch and display lesson details ([78b617a](https://github.com/bry-ly/Culm-LMS/commit/78b617a326b827717558de995f693c679aa55664))
- create SlugPage component for displaying individual course details ([5aa4877](https://github.com/bry-ly/Culm-LMS/commit/5aa487737345142ea0331e47c566806c01c585c4))
- **dashboard:** add error boundary and loading state ([0391faf](https://github.com/bry-ly/Culm-LMS/commit/0391faf71110539c05f70b3632139d9020b2ded5))
- **dashboard:** add markLessonComplete action with completion email ([9ec5990](https://github.com/bry-ly/Culm-LMS/commit/9ec59908a2292966060afb2d8813e29ce749b77c))
- **emails:** add React Email templates for transactional emails ([4861cc1](https://github.com/bry-ly/Culm-LMS/commit/4861cc1a052d7bf1aeca9f6e358e1d63e53521ca))
- enhance course management with chapter and lesson creation, deletion, and reordering functionalities ([8697ca5](https://github.com/bry-ly/Culm-LMS/commit/8697ca5e322dab5caf1046423cbb923a78a42993))
- enhance global styles with new color variables and dark mode support ([c9945f6](https://github.com/bry-ly/Culm-LMS/commit/c9945f6ac5965c2024503c9fea3caa731eea094e))
- enhance RenderUploadedState to support video previews alongside images ([991fe1b](https://github.com/bry-ly/Culm-LMS/commit/991fe1b43c47a954bf069a47e2d6e067c399cf4d))
- enhance RenderUploadingState with circular progress indicator and percentage display ([2cd1726](https://github.com/bry-ly/Culm-LMS/commit/2cd17268315a3ec5ea4b44ff043092216d695c8f))
- Free Course Support in Creation, Editing, and Display ([#1](https://github.com/bry-ly/Culm-LMS/issues/1)) ([ce493a1](https://github.com/bry-ly/Culm-LMS/commit/ce493a19f7d824ac3287e673dbdb6e7b548bae7f))
- implement adminGetCourse function for retrieving course details with admin protection ([c075d7d](https://github.com/bry-ly/Culm-LMS/commit/c075d7d3928f4e0303b7a73228ee490fb558a578))
- implement adminGetCourses function for retrieving course details with admin protection ([85f6a87](https://github.com/bry-ly/Culm-LMS/commit/85f6a87e9cf34b90b9288a0cab858be9eec44fb3))
- implement arcjet integration for enhanced security features ([be1babc](https://github.com/bry-ly/Culm-LMS/commit/be1babcb8c38ed68ef27930a77aed66c504f32a9))
- implement authentication module with betterAuth integration ([3191e6b](https://github.com/bry-ly/Culm-LMS/commit/3191e6b6ad1f9b740aa80684152e15b98f239d9b))
- implement CoursesPage component to display admin courses ([83fe445](https://github.com/bry-ly/Culm-LMS/commit/83fe445dd684e5aa0d681fee6c7fca6283d7fe6a))
- implement CourseStructure component for drag-and-drop chapter and lesson organization ([7b70fae](https://github.com/bry-ly/Culm-LMS/commit/7b70fae5c18db3d6b5a1598bc36d860b0364a8ee))
- implement CreateCourse function for admin course creation with validation and bot protection ([f33054f](https://github.com/bry-ly/Culm-LMS/commit/f33054fbf7de62f594457b179b6f83870a1590f9))
- implement DataTable component with drag-and-drop functionality and enhanced row management ([bd8c1e9](https://github.com/bry-ly/Culm-LMS/commit/bd8c1e99f0066b20357506787cf961fb32b10567))
- implement DELETE endpoint for S3 object deletion with admin protection and bot detection ([2caf086](https://github.com/bry-ly/Culm-LMS/commit/2caf086713204b3cddbe6b1ada225339e635607a))
- implement DeleteChapter component for chapter deletion with confirmation dialog ([b941d16](https://github.com/bry-ly/Culm-LMS/commit/b941d169779018a013f61f9bfe6b3d150cb2976b))
- implement file upload endpoint with admin protection and request validation ([eca98e6](https://github.com/bry-ly/Culm-LMS/commit/eca98e6fb1595295c9f4ea489b3df45221b38be2))
- implement file upload state components for enhanced user experience ([fd7481e](https://github.com/bry-ly/Culm-LMS/commit/fd7481e17b1815b4aa1655a799c9eb938c2cc58c))
- implement file uploader component with drag-and-drop support ([92584db](https://github.com/bry-ly/Culm-LMS/commit/92584dbe84a81673feab6059fad99e911a1f4341))
- implement getAllCourses function to fetch published courses from the database ([84b021d](https://github.com/bry-ly/Culm-LMS/commit/84b021d8231a43e0982fb5780686e99c436582b5))
- implement individual course detail page displaying course information, content, and enrollment details. ([dd932d0](https://github.com/bry-ly/Culm-LMS/commit/dd932d016d44d16f8af89612274a1181091be410))
- implement LessonForm component for lesson creation and editing with form validation ([a84d732](https://github.com/bry-ly/Culm-LMS/commit/a84d732c3cb5d43e206b9486cc84ba55b8f104a2))
- implement loading and empty state handling in CoursesPage component ([7936e42](https://github.com/bry-ly/Culm-LMS/commit/7936e42971eba60acfbc2a28f15fa92594311602))
- implement NewChapterModal component for creating new chapters in course management ([43d1760](https://github.com/bry-ly/Culm-LMS/commit/43d1760eb03bd0d7b31b4deefc8818876be427ac))
- implement PublicCourseCard and PublicCourseCardSkeleton components for course display ([8fce25c](https://github.com/bry-ly/Culm-LMS/commit/8fce25cfe06f2b8b2afaf17e298f2af2d37da89c))
- implement signup protection with email validation, bot detection, and rate limiting ([be59752](https://github.com/bry-ly/Culm-LMS/commit/be59752c11d808534db166c6716f3a974c40ccfb))
- integrate modals for creating and deleting chapters and lessons in CourseStructure component ([1999d0e](https://github.com/bry-ly/Culm-LMS/commit/1999d0e06cce4d8410cae195ded06dd8a263f938))
- Introduce animated theme toggle component, course detail page with actions, and payment success/cancel pages. ([774294e](https://github.com/bry-ly/Culm-LMS/commit/774294e0cdd9b50c7416a75455c4dbf53367411a))
- introduce delay in adminGetCourses function to simulate loading state ([fa8b383](https://github.com/bry-ly/Culm-LMS/commit/fa8b383352538af49290505aa04fe9c46a615f9d))
- **lesson:** add course completion email on final lesson ([1dae075](https://github.com/bry-ly/Culm-LMS/commit/1dae075ead2f93645a380da73f9757f2f5e19432))
- **lib:** add email helper utilities ([50c94c4](https://github.com/bry-ly/Culm-LMS/commit/50c94c414f26979e3cafb0958dfcc805b257c709))
- **lib:** update shared services ([302a9cf](https://github.com/bry-ly/Culm-LMS/commit/302a9cf6efd6f5bee69e5c90fb781c821afb6bc2))
- **login:** show last used login method badge ([506a878](https://github.com/bry-ly/Culm-LMS/commit/506a87878386e49a11bb808cf8885288188184f2))
- mobile-first responsiveness implementation ([#7](https://github.com/bry-ly/Culm-LMS/issues/7)) ([74f3110](https://github.com/bry-ly/Culm-LMS/commit/74f31107e0964a221b6b8c7394f58b10d22d92b9))
- **mobile:** add mobile course sidebar with floating FAB button ([e0c6b93](https://github.com/bry-ly/Culm-LMS/commit/e0c6b930888307c90257daed1f399bf34bbbbe60))
- **mobile:** add mobile navigation with animated hamburger menu ([1e74819](https://github.com/bry-ly/Culm-LMS/commit/1e748193690370f4f077833c5de2466a2b0faa69))
- **mobile:** integrate mobile sidebar, add safe area utilities and viewport config ([7fb8fb7](https://github.com/bry-ly/Culm-LMS/commit/7fb8fb78f6b793464a13be89d42b9f2e0ef52b7a))
- **mobile:** integrate MobileNav and hide desktop elements on mobile ([0697296](https://github.com/bry-ly/Culm-LMS/commit/069729619a330175a100c419eb6190e08db56bf3))
- remove default Home page component and related assets ([63052cc](https://github.com/bry-ly/Culm-LMS/commit/63052cc2a18032a3e080d8700a3cf3755200ffcc))
- remove Logo component from the project ([63e7c3e](https://github.com/bry-ly/Culm-LMS/commit/63e7c3e7953d99d55023111ccf4110ea633e9444))
- **seo:** add Course JSON-LD schema to course detail page ([48ae8a9](https://github.com/bry-ly/Culm-LMS/commit/48ae8a9d6280ac8ab6ae077ea57cbeae29120fe2))
- **seo:** add JSON-LD structured data to homepage ([a72c394](https://github.com/bry-ly/Culm-LMS/commit/a72c394c5ce971d43b90a842c7cbd4936f3e478e))
- **seo:** add robots.txt configuration ([506563c](https://github.com/bry-ly/Culm-LMS/commit/506563c90bd0d66f00549b1039f399ab669b8ab7))
- **stripe:** send enrollment and payment receipt emails ([3ec5a09](https://github.com/bry-ly/Culm-LMS/commit/3ec5a09d0f0256f242d42c6d818a59432f84386d))
- update color variables in globals.css for improved theming and consistency ([2f58c53](https://github.com/bry-ly/Culm-LMS/commit/2f58c53427085214d56c7d8d4b9dc831557b441b))
- update layout component with new metadata and integrate ThemeProvider and Toaster ([1983191](https://github.com/bry-ly/Culm-LMS/commit/1983191a07fb966389fb5f0279cc971010f790d8))
- update Logo component and title for consistency in AuthLayout ([daf0e82](https://github.com/bry-ly/Culm-LMS/commit/daf0e82b92dfa725ddee77e7dcc163412adc584c))
- update Logo import and sidebar title for Culm LMS branding ([4280ac7](https://github.com/bry-ly/Culm-LMS/commit/4280ac78b56831451d2462847b552c50b19c9999))
- update Logo import and text in Navbar for branding consistency ([bfdb737](https://github.com/bry-ly/Culm-LMS/commit/bfdb7375a448935787cc0fbde800feb1386eca43))
- update metadata title and icon formats for consistency ([ce2ce46](https://github.com/bry-ly/Culm-LMS/commit/ce2ce46f16c1c78e9a368525a9c2a6f59e8a9f8e))
- update site header title to Culm LMS branding ([74febd5](https://github.com/bry-ly/Culm-LMS/commit/74febd5de3a449c2ebcc8eb891c0b98165ad60ff))
- update Uploader component to accept fileTypeAccepted prop for dynamic file type handling and improve upload logic ([1ee757f](https://github.com/bry-ly/Culm-LMS/commit/1ee757f3c07edbbb6162d63154e10bdb3bd4b7b8))

### Bug Fixes

- add fileTypeAccepted prop to Uploader component for thumbnail image validation ([90070ed](https://github.com/bry-ly/Culm-LMS/commit/90070ed77b6b5fb36b17e6a09f557e88b613ffd0))
- **admin:** pass currentImageUrl to EditCourseForm ([eab1f4f](https://github.com/bry-ly/Culm-LMS/commit/eab1f4f0bd3afad712c7ab43e78071616599bcfc))
- **api:** update auth route handler export ([4f3a560](https://github.com/bry-ly/Culm-LMS/commit/4f3a560dc227ed2744d0230552366b13ad87da21))
- **auth:** improve error message for unauthorized users ([e432d77](https://github.com/bry-ly/Culm-LMS/commit/e432d77eabaae9d54307a8fa6b459c1382e76cd6))
- correct formatting in postcss.config.mjs for Tailwind CSS plugin ([6e3caec](https://github.com/bry-ly/Culm-LMS/commit/6e3caec90529ae56500ba23ccccbc4fbad9e45a3))
- **env:** remove unused AWS_ENDPOINT_URL_IAM variable ([#6](https://github.com/bry-ly/Culm-LMS/issues/6)) ([6cfb0a7](https://github.com/bry-ly/Culm-LMS/commit/6cfb0a7a9c02237b6343273df2b2662ee7dd2d4b))
- **sidebar:** use size-\* in chart component ([b994d6f](https://github.com/bry-ly/Culm-LMS/commit/b994d6fbfd6acce93779f304e06916557b92f7a5))
- **ui:** improve chart component type safety ([1392c8c](https://github.com/bry-ly/Culm-LMS/commit/1392c8c5c4ce63e729bdd3f369222f92e8e65471))
- **ui:** improve Toaster component styling ([384b0cf](https://github.com/bry-ly/Culm-LMS/commit/384b0cf5c42bdcc26905cbd915eebfd8ba6c4e8b))
- **ui:** use size-_ instead of w-_ h-\* in Spinner ([52f77c7](https://github.com/bry-ly/Culm-LMS/commit/52f77c7ac6d1786a2aef46c600651e0b05e0c033))
- update Toaster position to bottom-center and add close button ([f7bb266](https://github.com/bry-ly/Culm-LMS/commit/f7bb266cf0fc1def8388b7db04992b0277168ace))

## [Unreleased]

## [0.1.0] - 2025-01-08

### Features

- Initial release of Culm LMS
- User authentication with Better Auth (Google OAuth, email OTP)
- Course creation and management
- Lesson content with video support
- Payment integration with Stripe
- Admin dashboard for course management
- Student dashboard for course enrollment
- Mobile-responsive design
- Prisma ORM with PostgreSQL
- S3 storage for file uploads
- SEO optimization with Next.js metadata

### Technical

- Next.js 16 with App Router
- TypeScript with strict mode
- Tailwind CSS with shadcn/ui components
- React Server Components
- Server Actions for form handling
- Arcjet for bot protection and rate limiting
