import './App.css'
import NewsForm from './components/Form/NewsForm'
import { NavLink } from 'react-router-dom'

function App() {

	return (
		<>

			<div className="p-4 ">
				{/* Container for the Back button */}
				<div className="flex justify-start mb-6">
					<NavLink
						to="/"
						className="inline-flex items-center px-6 py-3 text-lg font-semibold rounded-full transition duration-300 ease-in-out bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-md hover:shadow-lg"
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
						</svg>
						Back
					</NavLink>
				</div>

				<div className='-mt-20'>
				<NewsForm />
				</div>
			</div>

		</>
	)

}

export default App


