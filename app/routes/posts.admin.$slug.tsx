import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData,redirect} from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";
import { getPost,updatePost,deletePost } from "~/models/post.server";

export const loader = async ({ params }) => {
    invariant(params.slug, "params.slug is required");
  
    const post = await getPost(params.slug);
    invariant(post, `Post not found: ${params.slug}`);
  
    return json({ post });
 };
 
 export const action = async ({ request, params }) => {
   const formData = await request.formData();
   const intent = formData.get("intent");
 
   if (intent === "delete") {
    await deletePost(params.slug);
  } else if (intent === "update") {
    const title = formData.get("title");
    const markdown = formData.get("markdown");
    await updatePost(params.slug, { title, markdown });
  }
 
   const title = formData.get("title");
   const markdown = formData.get("markdown");
 
   await updatePost(params.slug, { title, markdown });
   return redirect(`/posts/admin`);
 };

export default function PostAdminSlug() {
  const { post } = useLoaderData();

    function handleRedirect(arg0: string): void {
        throw new Error("Function not implemented.");
    }

  return (
    <Form method="post">
      <p>
        <label>
          Title: 
        </label>
        <input type="text" name="title" defaultValue={post.title} />
      </p>
      <p>
        <label>
          Markdown:
          
        </label>
        <br></br>
        <textarea name="markdown" defaultValue={post.markdown} rows={20}/>
      </p>
      <p className="text-right">
  <button
    type="submit"
    name="intent"
    value="update"
    className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
    >update
  </button>
  <br></br>
  <button
    type="submit"
    name="intent"
    value="delete"
    className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
    >delete
  </button>
</p>
    </Form>
  );
}