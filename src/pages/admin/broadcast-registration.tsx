import { useCallback } from "react";
import type { NextPage, GetServerSideProps } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { BaseLayout } from "src/components/Layouts/BaseLayout";
import { InputFiled } from "src/components/Form/InputFiled";
import { Button } from "src/components/Button";
import { BroadcastFormType, BroadcastType } from "src/types/interface";
import { createBroadcast, updateBroadcast, deleteBroadcast } from "src/lib/db";
import { getBroadcast } from "src/lib/db-admin";
import schemas from "src/lib/yupSchema/engiviaSchema";
import { initialBroadcastInfo } from "src/constant/initialState";

type Props = {
  broadcast: BroadcastType;
};

const Registration: NextPage<Props> = ({ broadcast }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BroadcastFormType>({
    resolver: yupResolver(schemas().pick(["title", "broadCastingDate"])),
  });

  const handleOnSubmit: SubmitHandler<BroadcastFormType> = useCallback(
    (data) => {
      const formData = {
        title: data.title,
        broadCastingDate: format(parseISO(data.broadCastingDate), "yyyy-MM-dd"),
      };

      if (broadcast.id === "") {
        createBroadcast(formData);
      } else {
        updateBroadcast(formData, broadcast.id);
      }
      router.push("/broadcasts");
    },
    [broadcast.id, router]
  );

  const handleOnDelete = useCallback(() => {
    deleteBroadcast(broadcast.id);
    router.push("/broadcasts");
    toast("放送を削除しました", {
      duration: 4000,
      position: "bottom-center",
      icon: "🗑️",
    });
  }, [broadcast.id, router]);

  return (
    <BaseLayout title="放送一覧">
      <div className="mx-auto max-w-3xl">
        <h1 className="py-10 mx-auto text-4xl font-bold text-gray-900">
          {broadcast.id === "" ? " 放送を作成" : "放送を編集"}
        </h1>
        <div className="flex flex-col gap-10 w-full">
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <InputFiled
              id="title"
              type="text"
              value={broadcast.title}
              placeholder="タイトルを入力する"
              register={register("title")}
            />
            {errors.title?.message && (
              <span className="text-base text-red-500">
                {errors.title?.message}
              </span>
            )}
            <InputFiled
              id="broadCastingDate"
              type="date"
              value={format(parseISO(broadcast.broadCastingDate), "yyyy-MM-dd")}
              placeholder="2021/09/03"
              register={register("broadCastingDate")}
              className="mt-8 mb-8"
            />
            {errors.broadCastingDate?.message && (
              <span className="text-base text-red-500">
                {errors.broadCastingDate?.message}
              </span>
            )}
            <div className="space-x-4 w-full text-center">
              <Button isSubmitting={false} isPrimary type="submit">
                保存する
              </Button>
              <Button
                isSubmitting={false}
                isPrimary={false}
                type="button"
                onClick={() => router.push("/broadcasts")}
              >
                キャンセル
              </Button>
              {broadcast.id !== "" && (
                <Button
                  isSubmitting={false}
                  isPrimary={false}
                  type="button"
                  onClick={() => setIsOpen(true)}
                >
                  削除する
                </Button>
              )}
            </div>
          </form>
        </div>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="overflow-y-auto fixed inset-0 z-10"
            onClose={() => setIsOpen(false)}
          >
            <div className="px-4 min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-75" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block overflow-hidden py-6 px-12 my-8 text-left align-middle bg-white rounded-md shadow-xl transition-all transform">
                  <p className="text-2xl">本当に放送を削除しますか？</p>
                  <div className="mt-6 text-center">
                    <Button
                      type="button"
                      isSubmitting={false}
                      isPrimary={true}
                      onClick={handleOnDelete}
                    >
                      削除する
                    </Button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </BaseLayout>
  );
};

export default Registration;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.query.id) {
    const broadcast = await getBroadcast(context.query.id as string);
    return { props: { broadcast } };
  } else return { props: { broadcast: initialBroadcastInfo } };
};
