import type { NextPage } from "next";
import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { BaseLayout } from "src/components/Layouts/BaseLayout";
import { signIn, useSession } from "next-auth/client";
import { Form } from "src/components/Form";
import { Button } from "src/components/Button";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { updateUsername } from "src/lib/users";

const UserAccount: NextPage = () => {
  const [session] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string>(session?.user.name as string);

  const router = useRouter();
  const closeModal = async () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    if (session?.user) {
      await updateUsername(session.user.id, name);
      signIn("credentials", { id: session.user.id });
      toast("保存しました", {
        duration: 4000,
        position: "top-center",
        className: "",
        icon: "👏",
      });
    }
  };

  return (
    <BaseLayout title="放送一覧">
      <div className="pt-10 mx-auto max-w-2xl">
        <div className="p-10 bg-white rounded-md shadow-sm">
          <h1 className="text-3xl font-bold text-center text-gray-700">
            アカウント編集
          </h1>
          <h2 className="mt-10 mb-2 font-bold text-gray-700">ユーザー名</h2>
          <Form
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ユーザー名を入力する"
          />

          <hr />
          <div className="flex flex-row-reverse content-end mt-5">
            <Button
              type="button"
              isSubmitting={false}
              isPrimary={true}
              onClick={handleSave}
            >
              保存する
            </Button>
            <Button
              type="button"
              isSubmitting={false}
              isPrimary={false}
              onClick={() => router.push("/broadcasts")}
            >
              キャンセル
            </Button>
          </div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-10"
          onClose={closeModal}
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
              <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-filter backdrop-blur-sm transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
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
              <div className="inline-block overflow-hidden p-3 my-8 text-left align-middle bg-white rounded-md shadow-xl transition-all transform">
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 text-sm font-medium text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-md border border-transparent focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus:outline-none"
                    onClick={closeModal}
                  >
                    トリミングする
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </BaseLayout>
  );
};

export default UserAccount;
