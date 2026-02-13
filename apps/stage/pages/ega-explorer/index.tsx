import EgaExplorer from '@/components/pages/egaExplorer';
import { createPage } from '../../global/utils/pages';

const EgaExplorerPage = createPage({
	isPublic: true,
})(() => <EgaExplorer />);

export default EgaExplorerPage;
