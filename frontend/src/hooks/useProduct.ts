

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createProduct, deleteProduct, getAllProducts, getMyProducts, getProductById, updateProduct } from '../lib/api'

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    select: (res) => res.products
  })
}


export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id
  })
}


export const useMyProducts = () => {
  return useQuery({
    queryKey: ["myProducts"],
    queryFn: getMyProducts,
    select: (res) => res.products
  })
}


export const useCreateProduct = () => {
  return useMutation({
    mutationFn: createProduct
  })
}


export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myProducts"]
      })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
    }
  })
}


export const useUpdateProduct = () => {
  const querClient = useQueryClient()
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, variables) => {
      querClient.invalidateQueries({
        queryKey: ["products"]
      })
      querClient.invalidateQueries({
        queryKey: ["product", variables.id]
      })
      querClient.invalidateQueries({
        queryKey: ["myProducts"]
      })
    }
  })
}