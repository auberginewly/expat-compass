import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout } from 'antd'

const { Footer } = Layout

const AppFooter = () => {
  const { t } = useTranslation(['common', 'footer'])

  return (
    <Footer className="bg-white/80 dark:bg-surface-dark/60 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* 关于我们 */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('footer:about.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('footer:about.description')}
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('footer:quickLinks.title')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/medical"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-gradientStart transition-colors"
                >
                  {t('footer:quickLinks.medical')}
                </Link>
              </li>
              <li>
                <Link
                  to="/transport"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-gradientStart transition-colors"
                >
                  {t('footer:quickLinks.transport')}
                </Link>
              </li>
              <li>
                <Link
                  to="/payment"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-gradientStart transition-colors"
                >
                  {t('footer:quickLinks.payment')}
                </Link>
              </li>
              <li>
                <Link
                  to="/education"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-gradientStart transition-colors"
                >
                  {t('footer:quickLinks.education')}
                </Link>
              </li>
              <li>
                <Link
                  to="/culture"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-gradientStart transition-colors"
                >
                  {t('footer:quickLinks.culture')}
                </Link>
              </li>
              <li>
                <Link
                  to="/forum"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-gradientStart transition-colors"
                >
                  {t('footer:quickLinks.forum')}
                </Link>
              </li>
            </ul>
          </div>

          {/* 法律信息 */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('footer:legal.title')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-gradientStart transition-colors"
                >
                  {t('footer:legal.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-gradientStart transition-colors"
                >
                  {t('footer:legal.terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* 关于我们 */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('footer:aboutUs.title')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-gradientStart transition-colors"
                >
                  {t('footer:aboutUs.page')}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/expat-compass/nanchang-expat-platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-gradientStart transition-colors flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t('footer:aboutUs.github')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              <p>© {new Date().getFullYear()} {t('footer:copyright')}</p>
              <p className="mt-1">
                {t('footer:icp.prefix')}{' '}
                <a
                  href="https://beian.miit.gov.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-gradientStart transition-colors"
                >
                  {t('footer:icp.number')}
                </a>
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              {t('footer:madeBy')}
            </div>
          </div>
        </div>
      </div>
    </Footer>
  )
}

export default AppFooter

