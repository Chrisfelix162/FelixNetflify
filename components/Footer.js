import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-white shadow-md mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Video Processing Service. All rights reserved.</p>
        <p className="mt-2">Powered by Netlify, Azure, and OpenAI</p>
      </div>
    </footer>
  )
}
