import {blueprintsSkeletonClassName} from '@/blueprints/Blueprints.css.tsx';
import {Skeleton} from 'monday-ui-react-core';
import React from 'react';

/**
 * blueprints skeleton
 * @return {ReactElement}
 */
export function BlueprintListSkeleton() {
  return <div className={blueprintsSkeletonClassName}>
    <Skeleton height={20}
      width={300}/>
    <Skeleton height={20}
      width={280}/>
    <Skeleton height={20}
      width={280}/>
    <Skeleton height={20}
      width={350}/>
    <Skeleton height={20}
      width={310}/>
  </div>;
}
