import type { FC } from "react";
import { EngiviaType } from "src/types/interface";

export type Props = {
  engivia: EngiviaType;
  totalLikes?: number;
};

export const EngiviaCard: FC<Props> = ({ engivia }) => {
  return (
    <div className="py-7 px-10 mx-auto mb-5 max-w-2xl bg-white rounded-lg">
      <div className="flex flex-col items-center mb-10">
        {engivia.engiviaNumber !== null && (
          <p className="mb-5 text-xl font-bold text-[#0284C7]">
            {`エンジビア${engivia.engiviaNumber}`}
          </p>
        )}
        <p className="text-4xl">{engivia.body}</p>
      </div>
      <div className="flex justify-between items-end">
        <div className="flex items-center">
          <img
            className="mr-2 h-8 rounded-full"
            src={engivia?.postUser.image}
            alt="avatar"
          />
          <span>{engivia?.postUser.name}</span>
        </div>
      </div>
    </div>
  );
};
