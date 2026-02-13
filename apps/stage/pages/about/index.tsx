import About from '@/components/pages/about';
import { createPage } from '../../global/utils/pages';

const AboutPage = createPage({
	isPublic: true,
})(() => <About />);

export default AboutPage;
