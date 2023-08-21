import React, {useState} from 'react';
import {Menu, MenuButton, MenuItem, MenuTitle} from 'monday-ui-react-core';
import {MoveArrowLeftDouble, CheckList, Download, Upload, Delete} from 'monday-ui-react-core/icons';
import {trpc} from '@/trpc.ts';
import {QueryClient, useQueryClient} from '@tanstack/react-query';
import {getQueryKey} from '@trpc/react-query';
import {useMondayContext} from '@/use-monday.ts';
import {buildItemsProducers} from '@/producers.ts';
import {useTranslation} from 'react-i18next';

type Props = {
    onOpenModal: (path: string) => void
};

/**
 * Button & Menu for settings that are available for a checklist in the item view
 * @param onOpenModal
 * @return {JSX.Element}
 */
export function ChecklistOptionsButton({onOpenModal}: Props) {
  const {t} = useTranslation('checklist');
  const [isOpen, setIsOpen] = useState(false);
  const {itemId} = useMondayContext();
  const queryClient: QueryClient = useQueryClient();
  const checklistQueryKey = getQueryKey(trpc.checklist.get, {itemId}, 'query');
  const {data: checklist} = trpc.checklist.get.useQuery({itemId});
  const deleteChecklist = trpc.checklist.delete.useMutation({
    onMutate: async () => {
      setIsOpen(false);
      await queryClient.cancelQueries(checklistQueryKey);
      const previousChecklist = queryClient.getQueryData(checklistQueryKey);
      queryClient.setQueryData(checklistQueryKey, null);
      return {previousChecklist};
    },
    onError: (err, variables, context) => {
      if (context?.previousChecklist) {
        queryClient.setQueryData(checklistQueryKey, context.previousChecklist);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(checklistQueryKey);
    },
  });
  const reset = () => {
    resetChecklist.mutate({
      checklist: {
        ...checklist,
        items: buildItemsProducers(checklist?.items).uncheckItems(),
      },
      itemId,
    });
  };
  const resetChecklist = trpc.checklist.set.useMutation({
    onMutate: async ({checklist}) => {
      setIsOpen(false);
      await queryClient.cancelQueries(checklistQueryKey);
      const previousChecklist = queryClient.getQueryData(checklistQueryKey);
      queryClient.setQueryData(checklistQueryKey, checklist);
      return {previousChecklist};
    },
    onError: (err, variables, context) => {
      if (context?.previousChecklist) {
        queryClient.setQueryData(checklistQueryKey, context.previousChecklist);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(checklistQueryKey);
    },
  });
  const openModal = (path: string) => {
    setIsOpen(false);
    onOpenModal(path);
  };
  return (
    <>
      <MenuButton text={t('more.options')}
        size={MenuButton.sizes.XS}
        open={isOpen}
        onMenuShow={() => setIsOpen(true)}
        onMenuHide={() => setIsOpen(false)}
      >
        <Menu size={Menu.sizes.XXS}>
          <MenuTitle caption={t('blueprints', {ns: 'blueprint'})}
            captionPosition={MenuTitle.positions.TOP}/>
          <MenuItem icon={CheckList}
            onClick={() => openModal('/module/blueprints')}
            iconType={MenuItem.iconType.SVG}
            title={t('options.manage', {ns: 'blueprint'})}/>
          <MenuItem icon={Upload}
            onClick={() => openModal('/module/blueprints/use')}
            iconType={MenuItem.iconType.SVG}
            title={t('options.load')}/>
          <MenuItem icon={Download}
            onClick={() => openModal('/module/blueprints/create?fromItemId=true')}
            iconType={MenuItem.iconType.SVG}
            title={t('options.save.as', {ns: 'blueprint'})}/>
        </Menu>
        <Menu size={Menu.sizes.XXS}>
          <MenuTitle caption="Other"
            captionPosition={MenuTitle.positions.TOP}/>
          <MenuItem icon={MoveArrowLeftDouble}
            onClick={reset}
            iconType={MenuItem.iconType.SVG}
            title={t('options.reset.this')}/>
          <MenuItem icon={Delete}
            onClick={() => deleteChecklist.mutate({itemId})}
            iconType={MenuItem.iconType.SVG}
            title={t('options.delete.this')}/>
        </Menu>
      </MenuButton>
    </>
  );
}
