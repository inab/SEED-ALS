import EgaTest from '@/components/pages/apiTest/ega';
import { createPage } from '../../../global/utils/pages';

const EgaTestPage = createPage({
	isPublic: true,
})(() => <EgaTest />);

export default EgaTestPage;
