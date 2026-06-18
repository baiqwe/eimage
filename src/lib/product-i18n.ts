import type { ProductLocale } from '@/components/product/product-locale';

export const PUBLIC_LABELS: Record<
  ProductLocale,
  {
    home: string;
    contact: string;
    waitlist: string;
    changelog: string;
    roadmap: string;
    blog: string;
    allPosts: string;
    ai: string;
    legal: string;
    privacy: string;
    terms: string;
    cookie: string;
  }
> = {
  zh: {
    home: '首页',
    contact: '联系我们',
    waitlist: '候补名单',
    changelog: '更新日志',
    roadmap: '路线图',
    blog: '博客',
    allPosts: '全部文章',
    ai: 'AI 演示',
    legal: '法律',
    privacy: '隐私政策',
    terms: '服务条款',
    cookie: 'Cookie 政策',
  },
  en: {
    home: 'Home',
    contact: 'Contact',
    waitlist: 'Waitlist',
    changelog: 'Changelog',
    roadmap: 'Roadmap',
    blog: 'Blog',
    allPosts: 'All posts',
    ai: 'AI Playground',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cookie: 'Cookie Policy',
  },
  ja: {
    home: 'ホーム',
    contact: 'お問い合わせ',
    waitlist: 'ウェイトリスト',
    changelog: '更新履歴',
    roadmap: 'ロードマップ',
    blog: 'ブログ',
    allPosts: 'すべての記事',
    ai: 'AI デモ',
    legal: '法務',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    cookie: 'Cookie ポリシー',
  },
  ko: {
    home: '홈',
    contact: '문의',
    waitlist: '대기 명단',
    changelog: '변경 내역',
    roadmap: '로드맵',
    blog: '블로그',
    allPosts: '전체 글',
    ai: 'AI 데모',
    legal: '법적 고지',
    privacy: '개인정보 처리방침',
    terms: '서비스 약관',
    cookie: '쿠키 정책',
  },
  es: {
    home: 'Inicio',
    contact: 'Contacto',
    waitlist: 'Lista de espera',
    changelog: 'Novedades',
    roadmap: 'Hoja de ruta',
    blog: 'Blog',
    allPosts: 'Todos los artículos',
    ai: 'Demo IA',
    legal: 'Legal',
    privacy: 'Política de privacidad',
    terms: 'Términos de servicio',
    cookie: 'Política de cookies',
  },
};

export const PUBLIC_PAGE_COPY: Record<
  ProductLocale,
  {
    contact: {
      title: string;
      description: string;
      formTitle: string;
      name: string;
      email: string;
      message: string;
      send: string;
      sending: string;
      success: string;
      error: string;
      placeholderName: string;
      placeholderEmail: string;
      placeholderMessage: string;
      nameMin: string;
      nameMax: string;
      emailInvalid: string;
      messageMin: string;
      messageMax: string;
    };
    waitlist: {
      title: string;
      description: string;
      formTitle: string;
      email: string;
      subscribe: string;
      subscribing: string;
      error: string;
      placeholderEmail: string;
      emailInvalid: string;
    };
    changelog: {
      title: string;
      subtitle: string;
      description: string;
    };
    roadmap: {
      title: string;
      subtitle: string;
      description: string;
      columns: {
        backlog: string;
        inProgress: string;
        done: string;
      };
      priorities: {
        low: string;
        medium: string;
        high: string;
      };
      tasks: {
        backlog: string[];
        inProgress: string[];
        done: string[];
      };
    };
    blog: {
      title: string;
      description: string;
      noPosts: string;
      page: string;
      of: string;
      previous: string;
      next: string;
    };
    ai: {
      title: string;
      description: string;
      note: string;
    };
  }
> = {
  zh: {
    contact: {
      title: '联系我们',
      description: '告诉我们你的商品图生成场景、API 接入计划或商业合作需求。',
      formTitle: '发送消息',
      name: '姓名',
      email: '邮箱',
      message: '消息',
      send: '发送',
      sending: '发送中...',
      success: '消息已发送',
      error: '发送失败，请稍后再试。',
      placeholderName: '你的姓名',
      placeholderEmail: 'name@example.com',
      placeholderMessage: '例如：我想为 Shopify 店铺批量生成主图和详情图...',
      nameMin: '姓名至少 3 个字符',
      nameMax: '姓名最多 30 个字符',
      emailInvalid: '请输入有效邮箱',
      messageMin: '消息至少 10 个字符',
      messageMax: '消息最多 500 个字符',
    },
    waitlist: {
      title: '加入候补名单',
      description: '第一时间获取真实生图 API、批量队列和点数包上线通知。',
      formTitle: '订阅产品更新',
      email: '邮箱',
      subscribe: '加入候补名单',
      subscribing: '提交中...',
      error: '订阅失败，请稍后再试。',
      placeholderEmail: 'name@example.com',
      emailInvalid: '请输入有效邮箱',
    },
    changelog: {
      title: '更新日志',
      subtitle: '查看 SuiteWorkbench 的产品迭代、SEO 和生成器能力更新。',
      description: '追踪我们发布的每个改进、修复和新功能。',
    },
    roadmap: {
      title: '产品路线图',
      subtitle: '围绕电商生图、点数计费、历史资产和 API 集成持续迭代。',
      description: '了解 SuiteWorkbench 接下来会建设的核心能力。',
      columns: { backlog: '计划中', inProgress: '进行中', done: '已完成' },
      priorities: { low: '低', medium: '中', high: '高' },
      tasks: {
        backlog: ['真实生图 API 接入', '前端抠图与主体 Mask', '多尺寸导出包'],
        inProgress: ['批量任务队列', '点数扣减与失败返还'],
        done: ['多语言工作台', '画廊与工具落地页'],
      },
    },
    blog: {
      title: '电商商品图博客',
      description: '分享 AI 商品摄影、主图优化、详情页视觉和 SEO 增长方法。',
      noPosts: '暂无文章',
      page: '第',
      of: '页，共',
      previous: '上一页',
      next: '下一页',
    },
    ai: {
      title: 'AI 能力演示',
      description: '这里保留底层 AI 能力的内部演示，正式产品入口请使用生成器。',
      note: '通用 AI 卡片仅用于研发验证，不作为电商生图主流程展示。',
    },
  },
  en: {
    contact: {
      title: 'Contact us',
      description:
        'Tell us about your product image workflow, API integration plans, or commercial needs.',
      formTitle: 'Send a message',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send',
      sending: 'Sending...',
      success: 'Message sent',
      error: 'Could not send the message. Please try again later.',
      placeholderName: 'Your name',
      placeholderEmail: 'name@example.com',
      placeholderMessage:
        'For example: I want to batch-generate hero and detail images for a Shopify store...',
      nameMin: 'Name must be at least 3 characters',
      nameMax: 'Name must be at most 30 characters',
      emailInvalid: 'Please enter a valid email',
      messageMin: 'Message must be at least 10 characters',
      messageMax: 'Message must be at most 500 characters',
    },
    waitlist: {
      title: 'Join the waitlist',
      description:
        'Get notified when the real generation API, batch queue, and credit packs go live.',
      formTitle: 'Subscribe to product updates',
      email: 'Email',
      subscribe: 'Join waitlist',
      subscribing: 'Submitting...',
      error: 'Subscription failed. Please try again later.',
      placeholderEmail: 'name@example.com',
      emailInvalid: 'Please enter a valid email',
    },
    changelog: {
      title: 'Changelog',
      subtitle:
        'Follow SuiteWorkbench updates across product, SEO, and generator capabilities.',
      description: 'Track every improvement, fix, and new feature we ship.',
    },
    roadmap: {
      title: 'Product roadmap',
      subtitle:
        'We are iterating on ecommerce generation, credits, asset history, and API integrations.',
      description: 'See what SuiteWorkbench is building next.',
      columns: { backlog: 'Backlog', inProgress: 'In progress', done: 'Done' },
      priorities: { low: 'Low', medium: 'Medium', high: 'High' },
      tasks: {
        backlog: [
          'Real image-generation API',
          'Foreground mask editor',
          'Multi-size export packs',
        ],
        inProgress: [
          'Batch task queue',
          'Credit debits and failed-job refunds',
        ],
        done: ['Multilingual workbench', 'Gallery and tool landing pages'],
      },
    },
    blog: {
      title: 'Ecommerce Product Image Blog',
      description:
        'Guides on AI product photography, marketplace hero images, detail-page visuals, and SEO growth.',
      noPosts: 'No posts yet',
      page: 'Page',
      of: 'of',
      previous: 'Previous',
      next: 'Next',
    },
    ai: {
      title: 'AI capability demo',
      description:
        'This page keeps low-level AI demos for internal validation. Use the generator for the product workflow.',
      note: 'Generic AI cards are kept for development testing, not for the ecommerce image generation flow.',
    },
  },
  ja: {
    contact: {
      title: 'お問い合わせ',
      description:
        '商品画像ワークフロー、API 連携、商用利用についてお聞かせください。',
      formTitle: 'メッセージを送信',
      name: '名前',
      email: 'メール',
      message: 'メッセージ',
      send: '送信',
      sending: '送信中...',
      success: '送信しました',
      error: '送信できませんでした。時間をおいて再試行してください。',
      placeholderName: 'お名前',
      placeholderEmail: 'name@example.com',
      placeholderMessage:
        '例：Shopify 店舗向けに主画像と詳細画像を一括生成したい...',
      nameMin: '名前は 3 文字以上にしてください',
      nameMax: '名前は 30 文字以内にしてください',
      emailInvalid: '有効なメールアドレスを入力してください',
      messageMin: 'メッセージは 10 文字以上にしてください',
      messageMax: 'メッセージは 500 文字以内にしてください',
    },
    waitlist: {
      title: 'ウェイトリストに参加',
      description:
        '実生成 API、バッチキュー、クレジットパックの公開情報を受け取れます。',
      formTitle: '製品アップデートを購読',
      email: 'メール',
      subscribe: '参加する',
      subscribing: '送信中...',
      error: '登録できませんでした。時間をおいて再試行してください。',
      placeholderEmail: 'name@example.com',
      emailInvalid: '有効なメールアドレスを入力してください',
    },
    changelog: {
      title: '更新履歴',
      subtitle: 'SuiteWorkbench の製品、SEO、生成機能の更新を確認できます。',
      description: '改善、修正、新機能の履歴を追跡します。',
    },
    roadmap: {
      title: '製品ロードマップ',
      subtitle:
        'EC 画像生成、クレジット、素材履歴、API 連携を継続的に改善します。',
      description: 'SuiteWorkbench が次に構築する機能を確認できます。',
      columns: { backlog: '計画中', inProgress: '進行中', done: '完了' },
      priorities: { low: '低', medium: '中', high: '高' },
      tasks: {
        backlog: [
          '実生成 API 連携',
          '前景 Mask エディタ',
          '複数サイズ書き出し',
        ],
        inProgress: ['バッチタスクキュー', 'クレジット消費と失敗時返還'],
        done: ['多言語ワークベンチ', 'ギャラリーとツール LP'],
      },
    },
    blog: {
      title: 'EC 商品画像ブログ',
      description: 'AI 商品撮影、主画像改善、詳細ページ、SEO 成長のガイド。',
      noPosts: '記事はまだありません',
      page: 'ページ',
      of: '/',
      previous: '前へ',
      next: '次へ',
    },
    ai: {
      title: 'AI 機能デモ',
      description:
        'このページは低レベル AI 機能の検証用です。正式な商品画像生成は生成ツールを使用してください。',
      note: '汎用 AI カードは開発検証用であり、EC 商品画像生成の主導線ではありません。',
    },
  },
  ko: {
    contact: {
      title: '문의',
      description:
        '상품 이미지 워크플로, API 연동, 비즈니스 요구를 알려주세요.',
      formTitle: '메시지 보내기',
      name: '이름',
      email: '이메일',
      message: '메시지',
      send: '보내기',
      sending: '보내는 중...',
      success: '메시지가 전송되었습니다',
      error: '전송에 실패했습니다. 잠시 후 다시 시도하세요.',
      placeholderName: '이름',
      placeholderEmail: 'name@example.com',
      placeholderMessage:
        '예: Shopify 스토어용 메인/상세 이미지를 일괄 생성하고 싶습니다...',
      nameMin: '이름은 최소 3자여야 합니다',
      nameMax: '이름은 최대 30자여야 합니다',
      emailInvalid: '올바른 이메일을 입력하세요',
      messageMin: '메시지는 최소 10자여야 합니다',
      messageMax: '메시지는 최대 500자여야 합니다',
    },
    waitlist: {
      title: '대기 명단 참여',
      description:
        '실제 생성 API, 배치 큐, 크레딧 패키지 출시 소식을 받으세요.',
      formTitle: '제품 업데이트 구독',
      email: '이메일',
      subscribe: '참여하기',
      subscribing: '제출 중...',
      error: '구독에 실패했습니다. 잠시 후 다시 시도하세요.',
      placeholderEmail: 'name@example.com',
      emailInvalid: '올바른 이메일을 입력하세요',
    },
    changelog: {
      title: '변경 내역',
      subtitle: 'SuiteWorkbench의 제품, SEO, 생성기 업데이트를 확인하세요.',
      description: '개선, 수정, 신규 기능을 추적합니다.',
    },
    roadmap: {
      title: '제품 로드맵',
      subtitle: '이커머스 생성, 크레딧, 에셋 기록, API 연동을 계속 개선합니다.',
      description: 'SuiteWorkbench가 다음에 구축할 기능을 확인하세요.',
      columns: { backlog: '계획', inProgress: '진행 중', done: '완료' },
      priorities: { low: '낮음', medium: '중간', high: '높음' },
      tasks: {
        backlog: [
          '실제 이미지 생성 API',
          '전경 Mask 편집기',
          '다중 크기 내보내기',
        ],
        inProgress: ['배치 작업 큐', '크레딧 차감 및 실패 환불'],
        done: ['다국어 워크벤치', '갤러리 및 도구 랜딩 페이지'],
      },
    },
    blog: {
      title: '이커머스 상품 이미지 블로그',
      description: 'AI 상품 촬영, 메인 이미지, 상세 페이지, SEO 성장 가이드.',
      noPosts: '아직 글이 없습니다',
      page: '페이지',
      of: '/',
      previous: '이전',
      next: '다음',
    },
    ai: {
      title: 'AI 기능 데모',
      description:
        '이 페이지는 저수준 AI 기능 검증용입니다. 실제 상품 이미지 생성은 생성기를 사용하세요.',
      note: '범용 AI 카드는 개발 테스트용이며 이커머스 이미지 생성의 주요 흐름이 아닙니다.',
    },
  },
  es: {
    contact: {
      title: 'Contacto',
      description:
        'Cuéntanos tu flujo de imágenes de producto, planes de API o necesidades comerciales.',
      formTitle: 'Enviar mensaje',
      name: 'Nombre',
      email: 'Email',
      message: 'Mensaje',
      send: 'Enviar',
      sending: 'Enviando...',
      success: 'Mensaje enviado',
      error: 'No se pudo enviar. Inténtalo de nuevo más tarde.',
      placeholderName: 'Tu nombre',
      placeholderEmail: 'name@example.com',
      placeholderMessage:
        'Ejemplo: quiero generar imágenes principales y de detalle para Shopify...',
      nameMin: 'El nombre debe tener al menos 3 caracteres',
      nameMax: 'El nombre debe tener como máximo 30 caracteres',
      emailInvalid: 'Introduce un email válido',
      messageMin: 'El mensaje debe tener al menos 10 caracteres',
      messageMax: 'El mensaje debe tener como máximo 500 caracteres',
    },
    waitlist: {
      title: 'Únete a la lista',
      description:
        'Recibe novedades sobre la API real, cola por lotes y paquetes de créditos.',
      formTitle: 'Suscribirse a novedades',
      email: 'Email',
      subscribe: 'Unirme',
      subscribing: 'Enviando...',
      error: 'No se pudo suscribir. Inténtalo de nuevo más tarde.',
      placeholderEmail: 'name@example.com',
      emailInvalid: 'Introduce un email válido',
    },
    changelog: {
      title: 'Novedades',
      subtitle:
        'Actualizaciones de producto, SEO y generación de SuiteWorkbench.',
      description: 'Sigue cada mejora, corrección y nueva función.',
    },
    roadmap: {
      title: 'Hoja de ruta',
      subtitle: 'Iteramos en generación ecommerce, créditos, historial y API.',
      description: 'Mira lo que SuiteWorkbench construirá a continuación.',
      columns: {
        backlog: 'Planificado',
        inProgress: 'En progreso',
        done: 'Hecho',
      },
      priorities: { low: 'Baja', medium: 'Media', high: 'Alta' },
      tasks: {
        backlog: [
          'API real de generación',
          'Editor de Mask',
          'Exportación multiformato',
        ],
        inProgress: ['Cola de lotes', 'Créditos y reembolsos por fallo'],
        done: ['Workbench multilingüe', 'Galería y landing pages'],
      },
    },
    blog: {
      title: 'Blog de imágenes ecommerce',
      description:
        'Guías sobre fotografía IA, imágenes principales, páginas de detalle y SEO.',
      noPosts: 'Aún no hay artículos',
      page: 'Página',
      of: 'de',
      previous: 'Anterior',
      next: 'Siguiente',
    },
    ai: {
      title: 'Demo de capacidades IA',
      description:
        'Esta página conserva demos técnicas. Usa el generador para el flujo de producto.',
      note: 'Las tarjetas IA genéricas son para pruebas internas, no para el flujo principal ecommerce.',
    },
  },
};

export const LEGAL_PAGE_COPY: Record<
  ProductLocale,
  Record<
    'privacy' | 'terms' | 'cookie',
    {
      title: string;
      description: string;
      sections: Array<{ title: string; body: string[] }>;
    }
  >
> = {
  zh: {
    privacy: {
      title: '隐私政策',
      description:
        'SuiteWorkbench 如何处理账户数据、上传商品图、Prompt、生成历史和账单记录。',
      sections: [
        {
          title: '我们收集的信息',
          body: [
            '我们会处理账户信息、上传的商品图片、商品描述、Prompt、任务配置、生成结果、点数消耗、订阅和支付事件。',
            '我们也会收集基础访问、设备、错误日志和支持沟通信息，用于安全、性能和产品改进。',
          ],
        },
        {
          title: '我们如何使用信息',
          body: [
            '这些信息用于提供生成器、画廊、控制台、订阅、点数校验、生成历史和下载能力。',
            '当接入真实生图 API 后，源图、Mask、Prompt 和任务参数可能会发送给第三方 AI 基础设施以完成生成。',
          ],
        },
        {
          title: '存储与删除',
          body: [
            '我们可能保存源图、生成图、Prompt 和任务记录，方便你复用资产。不同套餐可能有不同保留周期。',
            '你可以通过联系我们请求访问、更正、导出或删除相关个人数据和生成资产。',
          ],
        },
      ],
    },
    terms: {
      title: '服务条款',
      description:
        '使用 SuiteWorkbench 上传商品素材、生成图片、消费点数和管理订阅时适用的条款。',
      sections: [
        {
          title: '服务使用',
          body: [
            'SuiteWorkbench 帮助电商团队基于上传商品图生成主图、详情页场景图和广告素材方向。',
            '你需要确保自己有权上传源素材，并有权使用由这些素材生成的输出。',
          ],
        },
        {
          title: '生成结果与点数',
          body: [
            '生成任务可能消耗订阅点数或点数包余额。任务开始前可能进行余额校验。',
            'AI 输出可能包含瑕疵或不符合平台规则的内容，发布前需要由你自行审核。',
          ],
        },
        {
          title: '禁止行为',
          body: [
            '不得上传无权使用、违法、侵权、欺诈、恶意或规避计费与安全限制的内容。',
            '我们可以因滥用、欺诈、安全风险、欠费或违反条款而暂停或终止服务。',
          ],
        },
      ],
    },
    cookie: {
      title: 'Cookie 政策',
      description:
        'SuiteWorkbench 如何使用 Cookie、本地存储和类似技术保存登录、语言、分析与支付状态。',
      sections: [
        {
          title: '用途',
          body: [
            '必要 Cookie 用于登录、安全、结账和控制台会话；偏好 Cookie 用于记住语言、主题和工作台设置。',
            '分析 Cookie 帮助我们理解页面性能、功能使用和错误情况。',
          ],
        },
        {
          title: '产品偏好',
          body: [
            '生成器可能在浏览器本地记住语言、草稿描述、风格选择和界面偏好，让你下次继续工作。',
          ],
        },
        {
          title: '管理方式',
          body: [
            '你可以通过浏览器设置删除或阻止 Cookie。关闭必要 Cookie 可能导致登录、账单、历史记录或语言切换无法正常工作。',
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      title: 'Privacy Policy',
      description:
        'How SuiteWorkbench handles account data, uploaded product images, prompts, generation history, and billing records.',
      sections: [
        {
          title: 'Information we collect',
          body: [
            'We process account details, uploaded product images, product descriptions, prompts, task settings, generated outputs, credit usage, subscriptions, and payment events.',
            'We also collect basic usage, device, error, and support information for security, performance, and product improvement.',
          ],
        },
        {
          title: 'How we use information',
          body: [
            'We use this information to provide the generator, gallery, dashboard, subscriptions, credit checks, generation history, and downloads.',
            'When real image-generation APIs are connected, source images, masks, prompts, and task parameters may be sent to third-party AI infrastructure to complete the requested generation.',
          ],
        },
        {
          title: 'Storage and deletion',
          body: [
            'We may store source images, generated images, prompts, and task records so you can reuse assets. Retention may vary by plan.',
            'You can contact us to request access, correction, export, or deletion of personal data and generated assets where applicable.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      description:
        'Terms for using SuiteWorkbench uploads, AI generation, credits, subscriptions, and generated assets.',
      sections: [
        {
          title: 'Use of the service',
          body: [
            'SuiteWorkbench helps ecommerce teams generate marketplace hero images, detail scenes, and ad creative directions from uploaded product images.',
            'You must have the right to upload source material and use outputs generated from that material.',
          ],
        },
        {
          title: 'Outputs and credits',
          body: [
            'Generation tasks may consume subscription credits or credit-pack balance. Credit checks may happen before a task starts.',
            'AI outputs can contain artifacts or fail marketplace rules, so you are responsible for reviewing assets before publication.',
          ],
        },
        {
          title: 'Prohibited use',
          body: [
            'Do not upload content you do not have rights to use, or use the service for illegal, infringing, deceptive, abusive, or billing-bypass activity.',
            'We may suspend or terminate access for abuse, fraud, security risk, non-payment, or Terms violations.',
          ],
        },
      ],
    },
    cookie: {
      title: 'Cookie Policy',
      description:
        'How SuiteWorkbench uses cookies, local storage, and similar technologies for login, language, analytics, and payments.',
      sections: [
        {
          title: 'Purposes',
          body: [
            'Essential cookies support login, security, checkout, and dashboard sessions. Preference cookies remember language, theme, and workspace settings.',
            'Analytics cookies help us understand page performance, feature usage, and errors.',
          ],
        },
        {
          title: 'Product preferences',
          body: [
            'The generator may remember language, draft descriptions, style choices, and interface preferences locally in your browser.',
          ],
        },
        {
          title: 'Managing cookies',
          body: [
            'You can delete or block cookies in your browser. Disabling essential cookies may break login, billing, history, or language switching.',
          ],
        },
      ],
    },
  },
  ja: {
    privacy: {
      title: 'プライバシーポリシー',
      description:
        'SuiteWorkbench におけるアカウント、商品画像、Prompt、生成履歴、請求情報の扱い。',
      sections: [
        {
          title: '収集する情報',
          body: [
            'アカウント情報、アップロード画像、商品説明、Prompt、タスク設定、生成結果、クレジット使用、契約、決済イベントを処理します。',
            '安全性、性能、改善のために利用状況、端末、エラー、サポート情報も扱います。',
          ],
        },
        {
          title: '利用目的',
          body: [
            '生成器、ギャラリー、ダッシュボード、契約、クレジット確認、履歴、ダウンロード提供に使用します。',
            '実生成 API 接続後は、元画像、Mask、Prompt、タスク設定を第三者 AI 基盤に送信する場合があります。',
          ],
        },
        {
          title: '保存と削除',
          body: [
            '素材再利用のため、元画像、生成画像、Prompt、タスク記録を保存する場合があります。',
            '適用法令の範囲で、データの確認、修正、エクスポート、削除を依頼できます。',
          ],
        },
      ],
    },
    terms: {
      title: '利用規約',
      description:
        'SuiteWorkbench のアップロード、AI 生成、クレジット、契約、生成素材に関する規約。',
      sections: [
        {
          title: 'サービス利用',
          body: [
            'SuiteWorkbench はアップロード商品画像から主画像、詳細シーン、広告素材の方向性を生成します。',
            '素材をアップロードし、その出力を利用する権利を保有している必要があります。',
          ],
        },
        {
          title: '出力とクレジット',
          body: [
            '生成タスクはサブスクまたはクレジット残高を消費する場合があります。',
            'AI 出力には不具合や規約不適合があり得るため、公開前に確認してください。',
          ],
        },
        {
          title: '禁止事項',
          body: [
            '権利のない素材、違法、侵害、欺瞞、悪用、課金回避目的での利用は禁止です。',
            '不正利用、未払い、セキュリティリスク、規約違反がある場合、利用を停止できます。',
          ],
        },
      ],
    },
    cookie: {
      title: 'Cookie ポリシー',
      description:
        'ログイン、言語、分析、決済のための Cookie とローカル保存の利用について。',
      sections: [
        {
          title: '目的',
          body: [
            '必須 Cookie はログイン、安全、決済、ダッシュボードに使われます。設定 Cookie は言語、テーマ、作業設定を記憶します。',
            '分析 Cookie はページ性能、機能利用、エラー理解に役立ちます。',
          ],
        },
        {
          title: '製品設定',
          body: [
            '生成器は言語、説明草稿、スタイル、UI 設定をブラウザに保存する場合があります。',
          ],
        },
        {
          title: '管理',
          body: [
            'ブラウザで Cookie を削除またはブロックできます。必須 Cookie を無効にすると一部機能が動作しません。',
          ],
        },
      ],
    },
  },
  ko: {
    privacy: {
      title: '개인정보 처리방침',
      description:
        'SuiteWorkbench가 계정, 상품 이미지, Prompt, 생성 기록, 결제 정보를 처리하는 방식.',
      sections: [
        {
          title: '수집 정보',
          body: [
            '계정 정보, 업로드 이미지, 상품 설명, Prompt, 작업 설정, 생성 결과, 크레딧 사용, 구독, 결제 이벤트를 처리합니다.',
            '보안, 성능, 개선을 위해 사용, 기기, 오류, 지원 정보도 처리합니다.',
          ],
        },
        {
          title: '사용 목적',
          body: [
            '생성기, 갤러리, 대시보드, 구독, 크레딧 확인, 생성 기록, 다운로드 제공에 사용합니다.',
            '실제 생성 API 연결 후 원본 이미지, Mask, Prompt, 작업 설정이 제3자 AI 인프라로 전송될 수 있습니다.',
          ],
        },
        {
          title: '저장 및 삭제',
          body: [
            '에셋 재사용을 위해 원본 이미지, 생성 이미지, Prompt, 작업 기록을 저장할 수 있습니다.',
            '적용 가능한 범위에서 데이터 접근, 수정, 내보내기, 삭제를 요청할 수 있습니다.',
          ],
        },
      ],
    },
    terms: {
      title: '서비스 약관',
      description:
        'SuiteWorkbench 업로드, AI 생성, 크레딧, 구독, 생성 에셋 사용 조건.',
      sections: [
        {
          title: '서비스 이용',
          body: [
            'SuiteWorkbench는 업로드된 상품 이미지로 메인 이미지, 상세 장면, 광고 소재 방향을 생성합니다.',
            '소스 소재를 업로드하고 결과물을 사용할 권리가 있어야 합니다.',
          ],
        },
        {
          title: '결과물과 크레딧',
          body: [
            '생성 작업은 구독 크레딧 또는 크레딧 팩 잔액을 사용할 수 있습니다.',
            'AI 결과에는 오류나 플랫폼 규칙 미준수가 있을 수 있으므로 게시 전 검토해야 합니다.',
          ],
        },
        {
          title: '금지 행위',
          body: [
            '권리 없는 소재, 불법, 침해, 기만, 악용, 결제 우회 목적 사용은 금지됩니다.',
            '남용, 사기, 보안 위험, 미결제, 약관 위반 시 서비스를 제한할 수 있습니다.',
          ],
        },
      ],
    },
    cookie: {
      title: '쿠키 정책',
      description:
        '로그인, 언어, 분석, 결제를 위한 쿠키와 로컬 저장소 사용 방식.',
      sections: [
        {
          title: '목적',
          body: [
            '필수 쿠키는 로그인, 보안, 결제, 대시보드 세션에 사용됩니다. 설정 쿠키는 언어, 테마, 작업 설정을 저장합니다.',
            '분석 쿠키는 페이지 성능, 기능 사용, 오류 파악에 도움을 줍니다.',
          ],
        },
        {
          title: '제품 설정',
          body: [
            '생성기는 언어, 설명 초안, 스타일, UI 설정을 브라우저에 저장할 수 있습니다.',
          ],
        },
        {
          title: '관리',
          body: [
            '브라우저에서 쿠키를 삭제하거나 차단할 수 있습니다. 필수 쿠키를 끄면 일부 기능이 작동하지 않을 수 있습니다.',
          ],
        },
      ],
    },
  },
  es: {
    privacy: {
      title: 'Política de privacidad',
      description:
        'Cómo SuiteWorkbench trata cuenta, imágenes, Prompt, historial y facturación.',
      sections: [
        {
          title: 'Información que recopilamos',
          body: [
            'Procesamos cuenta, imágenes subidas, descripciones, Prompt, ajustes de tarea, resultados, créditos, suscripciones y eventos de pago.',
            'También usamos datos de uso, dispositivo, errores y soporte para seguridad, rendimiento y mejora del producto.',
          ],
        },
        {
          title: 'Uso de la información',
          body: [
            'La usamos para ofrecer generador, galería, panel, suscripciones, créditos, historial y descargas.',
            'Cuando se conecten APIs reales, imagen fuente, Mask, Prompt y parámetros podrán enviarse a infraestructura IA externa.',
          ],
        },
        {
          title: 'Almacenamiento y eliminación',
          body: [
            'Podemos guardar imágenes fuente, resultados, Prompt y tareas para reutilizar assets.',
            'Puedes contactar para solicitar acceso, corrección, exportación o eliminación cuando aplique.',
          ],
        },
      ],
    },
    terms: {
      title: 'Términos de servicio',
      description:
        'Términos para subidas, generación IA, créditos, suscripciones y assets generados.',
      sections: [
        {
          title: 'Uso del servicio',
          body: [
            'SuiteWorkbench ayuda a generar imágenes principales, escenas de detalle y creatividades desde imágenes de producto.',
            'Debes tener derecho a subir el material fuente y usar los resultados generados.',
          ],
        },
        {
          title: 'Resultados y créditos',
          body: [
            'Las tareas pueden consumir créditos de suscripción o paquetes de créditos.',
            'Los resultados IA pueden contener errores o no cumplir reglas de marketplace; debes revisarlos antes de publicar.',
          ],
        },
        {
          title: 'Uso prohibido',
          body: [
            'No uses material sin derechos ni el servicio para fines ilegales, infractores, engañosos, abusivos o para evadir pagos.',
            'Podemos suspender acceso por abuso, fraude, riesgo de seguridad, impago o violación de términos.',
          ],
        },
      ],
    },
    cookie: {
      title: 'Política de cookies',
      description:
        'Uso de cookies y almacenamiento local para login, idioma, analítica y pagos.',
      sections: [
        {
          title: 'Finalidades',
          body: [
            'Las cookies esenciales soportan login, seguridad, checkout y panel. Las preferencias recuerdan idioma, tema y ajustes.',
            'Las cookies analíticas ayudan a entender rendimiento, uso y errores.',
          ],
        },
        {
          title: 'Preferencias del producto',
          body: [
            'El generador puede recordar idioma, borradores, estilos y preferencias de interfaz en tu navegador.',
          ],
        },
        {
          title: 'Gestión',
          body: [
            'Puedes borrar o bloquear cookies en el navegador. Desactivar cookies esenciales puede romper login, pagos, historial o idioma.',
          ],
        },
      ],
    },
  },
};
