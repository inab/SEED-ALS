import MonarchTest from '@/components/pages/apiTest/monarch';
import { createPage } from '../../../global/utils/pages';

const MonarchTestPage = createPage({
	isPublic: true,
})(() => <MonarchTest />);

export default MonarchTestPage;
