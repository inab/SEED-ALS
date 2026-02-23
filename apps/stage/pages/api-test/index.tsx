import ApiTestIndex from '@/components/pages/apiTest';
import { createPage } from '../../global/utils/pages';

const ApiTestPage = createPage({
	isPublic: true,
})(() => <ApiTestIndex />);

export default ApiTestPage;
