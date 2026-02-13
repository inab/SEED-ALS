import AlsOverview from '@/components/pages/alsOverview';
import { createPage } from '../../global/utils/pages';

const AlsOverviewPage = createPage({
	isPublic: true,
})(() => <AlsOverview />);

export default AlsOverviewPage;
