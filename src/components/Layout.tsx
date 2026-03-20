import { 
    SplitLayout, 
    PanelHeader, 
    SplitCol, 
    Epic, 
    View,
    Tabbar,
    Panel,
    TabbarItem,
    Group,
    Cell,
    ModalRoot,
    ModalCard,
    ButtonGroup,
    Button
} from '@vkontakte/vkui'
import { Icon28AllCategoriesOutline, Icon28Favorite } from '@vkontakte/icons';
import { Scale } from 'lucide-react';
import { useAdaptivityConditionalRender } from '@vkontakte/vkui';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUnit } from 'effector-react';
import { $modalState, closeModal, addFavorite } from '../store/favoritesStore';

export default function Layout({ goCatalog }: { goCatalog: () => void }) {
    const { viewWidth } = useAdaptivityConditionalRender();
    const location = useLocation();
    const navigation = useNavigate();

    const { modalId, film } = useUnit($modalState);
    const activeRouteId = location.pathname.split('/')[1] || 'catalog';
    
    const handleConfirmAdd = () => {
        if (film) addFavorite(film);
        closeModal();
    };

    const modal = (
        <ModalRoot activeModal={modalId} onClose={() => closeModal()}>
            <ModalCard
                    id="confirm-add"
                    onClose={() => closeModal()}
                    title="Добавить в избранное"
                    dismissButtonMode='none'
                    description={`Вы действительно хотите добавить фильм «${film?.name || film?.alternativeName || 'Без названия'}»?`}
                    actions={
                <ButtonGroup mode="horizontal" gap="s" stretched>
                    <Button size="l" mode="secondary" stretched onClick={() => closeModal()}>
                        Отмена
                    </Button>
                    <Button size="l" mode="primary" stretched onClick={handleConfirmAdd}>
                        Добавить
                    </Button>
                </ButtonGroup>
                }
            />
        </ModalRoot>
    );

    return (
        <SplitLayout header={
            <PanelHeader delimiter="none" />} modal={modal} center>
            {viewWidth.tabletPlus && (
                <SplitCol className={viewWidth.tabletPlus.className} width={280} maxWidth={280} fixed>
                    <Panel>
                    <PanelHeader />
                        <Group>
                            <Cell
                                before={<Icon28AllCategoriesOutline />}
                                activated={activeRouteId === 'catalog'}
                                onClick={goCatalog}
                            >
                                Каталог
                            </Cell>
                            <Cell
                                before={<Icon28Favorite />}
                                activated={activeRouteId === 'favorites'}
                                onClick={() => navigation('/favorites')}
                            >
                                Избранное
                            </Cell>
                            <Cell
                                before={<Scale size={24} />}
                                activated={activeRouteId === 'comparison'}
                                onClick={() => navigation('/comparison')}
                            >
                                Сравнение
                            </Cell>
                        </Group>
                    </Panel>
                </SplitCol>
            )}

            <SplitCol maxWidth="560px" stretchedOnMobile autoSpaced>
                <Epic 
                    activeStory='main'
                    tabbar={
                    viewWidth.tabletMinus && (
                        <Tabbar className={viewWidth.tabletMinus.className}>
                            <TabbarItem label="Каталог" selected={activeRouteId === 'catalog'} onClick={goCatalog}>
                            <Icon28AllCategoriesOutline />
                            </TabbarItem>
                            <TabbarItem label="Избранное" selected={activeRouteId === 'favorites'} onClick={() => navigation('/favorites')}>
                            <Icon28Favorite />
                            </TabbarItem>
                            <TabbarItem label="Сравнение" selected={activeRouteId === 'comparison'} onClick={() => navigation('/comparison')}>
                            <Scale size={24} />
                            </TabbarItem>
                        </Tabbar>
                    )
                }
                >
                    <View id="main" activePanel="main-panel">
                        <Panel id="main-panel">
                            <Outlet context={{ id: 'main-panel' }} />
                        </Panel>
                    </View>
                </Epic>
            </SplitCol>
        </SplitLayout>
    )
}