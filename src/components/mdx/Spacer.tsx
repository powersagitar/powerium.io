type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const sizeMap: Record<SpacerSize, string> = {
  xs: 'h-2',
  sm: 'h-4',
  md: 'h-8',
  lg: 'h-12',
  xl: 'h-16',
  '2xl': 'h-24',
};

type Props = {
  size?: SpacerSize;
};

export function Spacer({ size = 'md' }: Props) {
  return <div className={sizeMap[size]} aria-hidden="true" />;
}
